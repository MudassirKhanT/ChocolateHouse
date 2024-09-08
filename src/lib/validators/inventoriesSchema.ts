import { z } from "zod";
//using zod for schema validation
export const inventorySchema = z.object({
  sku: z.string({ message: "sku  should be a string" }).length(8, "SKU  should be 8 chars long"),
  warehouseId: z.number({ message: "Warehouse id should be a number" }),
  productId: z.number({ message: "Product id should be a number" }),
});
