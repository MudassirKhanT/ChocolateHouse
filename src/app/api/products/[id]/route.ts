import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/db";
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  try {
    const Product = await db
      .select()
      .from(products)
      .where(eq(products.id, Number(id)))
      .limit(1);
    if (!Product.length) {
      return Response.json({ message: "Product not found." }, { status: 400 });
    }
    return Response.json(Product[0]);
  } catch (err) {
    return Response.json({ message: "Failed to fetch product." }, { status: 500 });
  }
}
