import { z } from "zod";
//using zod for schema validation
export const orderSchema = z.object({
  pincode: z.string({ message: "pincode  should be a string" }).length(6, "pincode  should be 6 chars long"),
  qty: z.number({ message: "Qty  should be a number" }).nonnegative(),
  productId: z.number({ message: "Product id should be a number" }),
  address: z.string({ message: "Address should be a string" }).min(5, "Address should be atleast 5 chars long"),
});
