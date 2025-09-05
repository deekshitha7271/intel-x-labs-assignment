import {z} from 'zod';
import { formatNumberWithDecimal } from './utils';


const currency=z
   .string()
   .refine((value)=> /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),'Price must have exactly 2 decimal places')
//Schema for inserting products
export const insertProductSchema=z.object({
   name:z.string().min(3,'Name must be atleast 3 characters'),
   slug:z.string().min(3,'slug must be atleast 3 characters'),
   category:z.string().min(3,'category must be atleast 3 characters'),
   brand:z.string().min(3,'brand must be atleast 3 characters'),
   description:z.string().min(3,'Description must be atleast 3 characters'),
   stock:z.coerce.number(),//it will coerce into number if it comes as string
   images:z.array(z.string()).min(1,'Product must have atleast one image'),
   isFeatured:z.boolean(),
   banner:z.string().nullable(),//we added nullable because to say it as optional
   price: currency,
});

