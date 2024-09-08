import { z } from "zod";
//using zod for schema validation
export const warehouseSchema = z.object({
  name: z.string({ message: "Warehouse name should be a string" }),
  pincode: z.string({ message: "pincode  should be a string" }).length(6),
});
