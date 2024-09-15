import { z } from "zod";
//using zod for schema validation
const isServer = typeof window === "undefined";
export const productSchema = z.object({
  name: z.string({ message: "Product name should be a string" }).min(4),
  image: z.instanceof(isServer ? File : FileList, { message: "Product image should be a image" }),
  description: z.string({ message: "Product description should be a string" }).min(8),
  price: z.number({ message: "Product Price should be a number" }),
});
