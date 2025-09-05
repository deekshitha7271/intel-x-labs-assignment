'use server'
// import { PrismaClient } from "../generated/prisma"
import { prisma } from "@/db/prisma";
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
//function which fetches latest products which returns prism aobj.we convert it to plain js object.

//Get latest products
export async function getLatestProducts(){
    // const prisma = new PrismaClient();just import them from '@/db/prisma

    const data = await prisma.product.findMany({
        take: LATEST_PRODUCTS_LIMIT,
        orderBy:{createdAt:'desc'}
    });
    return convertToPlainObject(data);//this data is a prisma object
} 



//Get single product by it's slug
export async function getProductBySlug(slug: string){
    return await prisma.product.findFirst({
        where:{slug:slug}
    });
}