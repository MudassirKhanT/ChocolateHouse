import { db } from "@/lib/db/db";
import { inventories, products, warehouses } from "@/lib/db/schema";
import { inventorySchema } from "@/lib/validators/inventoriesSchema";
import { desc, eq } from "drizzle-orm";

export async function POST(request: Request) {
  const requestData = await request.json();

  let validatedData;
  try {
    validatedData = await inventorySchema.parse(requestData);
  } catch (err) {
    return Response.json({ message: err }, { status: 400 });
  }
  try {
    console.log("validatedData:", validatedData);
    await db.insert(inventories).values(validatedData);
    return Response.json({ message: "Ok" }, { status: 201 });
  } catch (err) {
    console.log("error:", err);

    return Response.json({ message: "Failed to store inventories into database" }, { status: 500 });
  }
}
export async function GET() {
  try {
    const AllInventories = await db
      .select({
        id: inventories.id,
        sku: inventories.sku,
        warehouse: warehouses.name,
        product: products.name,
      })
      .from(inventories)
      .leftJoin(warehouses, eq(inventories.warehouseId, warehouses.id))
      .leftJoin(products, eq(inventories.productId, products.id))
      .orderBy(desc(inventories.id));
    return Response.json(AllInventories);
  } catch (err) {
    return Response.json({ message: "Failed to Fetch inventories" }, { status: 500 });
  }
}
