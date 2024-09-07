import { z } from "zod";
//using zod for schema validation
export const productSchema = z.object({
  name: z.string({ message: "Product name should be a string" }),
  image: z.instanceof(File, { message: "Product image should be a image" }),
  description: z.string({ message: "Product description should be a string" }),
  price: z.number({ message: "Product Price should be a number" }),
});
