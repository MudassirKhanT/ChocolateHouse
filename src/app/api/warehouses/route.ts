import { db } from "@/lib/db/db";
import { warehouses } from "@/lib/db/schema";
import { warehouseSchema } from "@/lib/validators/warehouseSchema";

export async function POST(request: Request) {
  const requestData = await request.json();
  //todo:check auth
  let validatedData;
  try {
    validatedData = await warehouseSchema.parse(requestData);
  } catch (err) {
    return Response.json({ message: err }, { status: 400 });
  }

  try {
    await db.insert(warehouses).values(validatedData);
  } catch (err) {
    return Response.json({ message: "Failed to store the warehouse" }, { status: 500 });
  }
  return Response.json({ message: "Ok" }, { status: 201 });
}
export async function GET() {
  try {
    const Allwarehouses = await db.select().from(warehouses);
    return Response.json(Allwarehouses);
  } catch (err) {
    return Response.json({ message: "Failed to fetch all the warehouse" }, { status: 500 });
  }
}
