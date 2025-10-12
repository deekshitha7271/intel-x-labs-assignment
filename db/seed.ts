import { PrismaClient } from "@prisma/client";

import sampleData from "./sample-data";


//we are using async functions because prisma methods that we are going to use to get the products are asynchronous.
async function main(){
    try{
    const prisma = new PrismaClient();//initialize the prisma object
    await prisma.product.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.user.deleteMany();

    await prisma.product.createMany({data :sampleData.products})
    await prisma.user.createMany({data :sampleData.users})

    console.log("Database seeded successfully")
    }
    catch(error){
        console.error("Detailed Error:", JSON.stringify(error, null, 2));
        throw error; // rethrow for Next.js
    }

}
main();

//npx tsx ./db/seed