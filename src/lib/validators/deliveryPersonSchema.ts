import { z } from "zod";
//using zod for schema validation
export const deliveryPersonSchema = z.object({
  name: z.string({ message: "deliveryPerson name should be a string" }),
  phone: z.string({ message: "phone  should be a string" }).length(13, "Delivery person phone should be 13 chars long"),
  warehouseId: z.number({ message: "Warehouse id should be a number" }),
});
