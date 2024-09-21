import { authOptions } from "@/lib/auth/authOptions";
import { db } from "@/lib/db/db";
import { deliveryPersons, inventories, orders, products, warehouses } from "@/lib/db/schema";
import { orderSchema } from "@/lib/validators/orderSchema";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
  const requestData = await request.json();
  // get session
  const session = await getServerSession(authOptions);
  console.log("session:", session);
  if (!session) {
    return Response.json({ message: "Not allowed" }, { status: 401 });
  }
  //validate request body using zod
  let validatedData;
  try {
    validatedData = await orderSchema.parse(requestData);
  } catch (err) {
    return Response.json({ message: err }, { status: 400 });
  }
  console.log("validatedData:", validatedData);

  // Order Creation....

  const warehouseResult = await db.select({ id: warehouses.id }).from(warehouses).where(eq(warehouses.pincode, validatedData.pincode));

  if (!warehouseResult.length) {
    return Response.json({ message: "No warehouse found" }, { status: 400 });
  }

  const foundProducts = await db.select().from(products).where(eq(products.id, validatedData.productId)).limit(1);

  if (!foundProducts.length) {
    return Response.json({ message: "No product found" }, { status: 400 });
  }
  let transactionError: string = "";
  let finalOrder: any = null;
  // Start the transcation
  try {
    finalOrder = await db.transaction(async (tx) => {
      //1.Create order
      const order = await tx
        .insert(orders)
        .values({
          ...validatedData,
          //@ts-ignore
          userId: session.token.id,
          price: foundProducts[0].price * validatedData.qty,
          status: "recieved",
        })
        .returning({
          id: orders.id,
          price: orders.price,
        });

      //2. Check stock and lock using FOR_UPDATE and skip the locked rows

      const availableStock = await tx
        .select()
        .from(inventories)
        .where(and(eq(inventories.warehouseId, warehouseResult[0].id), eq(inventories.productId, validatedData.productId), isNull(inventories.orderId)))
        .limit(validatedData.qty)
        .for("update", { skipLocked: true });
      // 1 < 2 then do rollback of transaction
      if (availableStock.length < validatedData.qty) {
        transactionError = `Stock is low, only ${availableStock.length} products available`;
        tx.rollback();
        return;
      }

      //3. check delivery person availabilty

      const avaliablePersons = await tx
        .select()
        .from(deliveryPersons)
        .where(and(isNull(deliveryPersons.orderId), eq(deliveryPersons.warehouseId, warehouseResult[0].id)))
        .for("update")
        .limit(1);

      if (!avaliablePersons.length) {
        transactionError = `Delivery person is not available at the moment`;
        tx.rollback();
        return;
      }

      // stock is available and delivery person is available
      //update inventories table and add order id

      await tx
        .update(inventories)
        .set({ orderId: order[0].id })
        .where(
          inArray(
            inventories.id,
            availableStock.map((stock) => stock.id)
          )
        );

      // update the delivery persons and set order id

      await tx.update(deliveryPersons).set({ orderId: order[0].id }).where(eq(deliveryPersons.id, avaliablePersons[0].id));

      // update the order

      await tx.update(orders).set({ status: "reserved" }).where(eq(orders.id, order[0].id));

      return order[0];
    });
  } catch (err) {
    //log the error
    console.log("Error:", err);
    return Response.json({ message: transactionError ? transactionError : "Error while db transaction" }, { status: 500 });
  }

  // create invoice
}
