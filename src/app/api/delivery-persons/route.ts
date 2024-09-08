import { db } from "@/lib/db/db";
import { deliveryPersons, warehouses } from "@/lib/db/schema";
import { deliveryPersonSchema } from "@/lib/validators/deliveryPersonSchema";
import { desc, eq } from "drizzle-orm";

export async function POST(request: Request) {
  const requestData = await request.json();
  let validatedData;
  try {
    validatedData = await deliveryPersonSchema.parse(requestData);
  } catch (err) {
    return Response.json({ message: err }, { status: 400 });
  }
  try {
    await db.insert(deliveryPersons).values(validatedData);
    return Response.json({ message: "Ok" }, { status: 201 });
  } catch (err) {
    return Response.json({ message: "Failed to store the delivery person into the database" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const AllDeliveryPersons = await db
      .select({
        id: deliveryPersons.id,
        name: deliveryPersons.name,
        phone: deliveryPersons.phone,
        warehouse: warehouses.name,
      })
      .from(deliveryPersons)
      .leftJoin(warehouses, eq(deliveryPersons.warehouseId, warehouses.id))
      .orderBy(desc(deliveryPersons.id));
    return Response.json(AllDeliveryPersons);
  } catch (err) {
    return Response.json({ message: "Failed to Fetch the delivery person" }, { status: 500 });
  }
}
