'use server'
import { cookies } from "next/headers"
import { CartItem } from "@/types"
import { convertToPlainObject, formatError } from "../utils"
import { auth } from "@/auth"
import {prisma} from '@/db/prisma'
import { cartItemSchema, insertCartSchema } from "../validators"
import { round2 } from "../utils"
import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"
//Calculate cart prices
const calcPrice = (items:CartItem[])=>{
    const itemsPrice=round2(items.reduce((acc,item)=>acc+Number(item.price)*item.qty,0));
    const shippingPrice=round2(itemsPrice>100?0:10);
    const taxPrice=round2(0.15*itemsPrice);
    const totalPrice=round2(itemsPrice+shippingPrice+taxPrice);
    return {itemsPrice:itemsPrice.toFixed(2),shippingPrice:shippingPrice.toFixed(2),taxPrice:taxPrice.toFixed(2),totalPrice:totalPrice.toFixed(2)};
}

export async function addItemToCart(data:CartItem){
    try{
        //check for cart cookie
        const sessionCartId=(await cookies()).get('sessionCartId')?.value;
        if(!sessionCartId) throw new Error('Cart Session not found');

        //Get session and user ID
        const session = await auth();
        const userId = session?.user?.id ? (session.user.id as string):undefined;

        //Get cart
        const cart = await getMyCart();

        //Parse and validate item

        const item = cartItemSchema.parse(data);

        //Find product in database
        const product = await prisma.product.findFirst({

            where:{id:item.productId},

        });
        if(!product){
            throw new Error('Product not found');
        }
        if(!cart){
            //Create new cart Object
            const newCart=insertCartSchema.parse({
                sessionCartId:sessionCartId,
                userId:userId??null,
                items:[item],
                ...calcPrice([item])

            });

            //Add to database
            await prisma.cart.create({
                data:newCart
            })

            //Revalidate product page
            revalidatePath(`/product/${product.slug}`)
            return{
                    success:true,
                    message:`${product.name} Item added to cart`
                }

        //TESTING 
        console.log({
            'Session Cart ID':sessionCartId,
            'User ID':userId,
            'Item Requested':item,
           
            'Product Found':product,
            newCart
        })
        console.log(newCart)
    }else{
        //Check if item already in cart
        const existItem = (cart.items as CartItem[]).find((x)=>x.productId===item.productId);
        if(existItem){
            //Check stock
            if(product.stock<existItem.qty+1){
                throw new Error('Not Enough stock');
            }
            //Increase the quantity
            (cart.items as CartItem[]).find((x)=>x.productId===item.productId)!.qty=existItem.qty+1;
        
        } else{
            //If item doesnot exists in cart
            //check stock
            if(product.stock<1){
                throw new Error('Not Enough stock');
            }
            //add item to cart.items
            cart.items.push(item);

        }  
        //Save to database
        await prisma.cart.update({
            where:{id:cart.id},
            data:{
                items:cart.items as Prisma.CartUpdateitemsInput[],
                ...calcPrice(cart.items as CartItem[])
            }
        });
        //Revalidate product page
        revalidatePath(`/product/${product.slug}`);
        return{
            success:true,
            message:`${product.name} ${existItem ? 'Updated item in' : 'Added to'} cart`
        }
    }
        

    }catch(error){
       
        return {
            success:false,
            message:formatError(error)
        }

    }

    
}

export async function getMyCart(){

    //check for cart cookie
        const sessionCartId=(await cookies()).get('sessionCartId')?.value;
        if(!sessionCartId) throw new Error('Cart Session not found');

        //Get session and user ID
        const session = await auth();
        const userId = session?.user?.id ? (session.user.id as string):undefined;

        //Get user cart from database
        const cart = await prisma.cart.findFirst({
            where:userId?{userId:userId}:{sessionCartId:sessionCartId}

        });

        if(!cart) return undefined;

        //Convert decimals and return
        return convertToPlainObject({
            ...cart,
            items:cart.items as CartItem[],
            itemsPrice:cart.itemsPrice.toString(),
            totalPrice:cart.totalPrice.toString(),
            shippingPrice:cart.shippingPrice.toString(),
            taxPrice:cart.taxPrice.toString(),
        });

}

export async function removeItemFromCart(productId:string){
    try{
        //check for cart cookie
        const sessionCartId=(await cookies()).get('sessionCartId')?.value;
        if(!sessionCartId) throw new Error('Cart Session not found');
        //get product
        const product = await prisma.product.findFirst({
            where:{id:productId}
        });
        if(!product) throw new Error('Product not found');

        //Get user cart
        const cart = await getMyCart();
        if(!cart) throw new Error('Cart not found');

        //check for item
        const exist = (cart.items as CartItem[]).find((x)=>x.productId===productId);
        if(!exist) throw new Error('Item not found in cart');

        //check if only one in qty
        if(exist.qty===1){
            //remove item from cart
            cart.items=(cart.items as CartItem[]).filter((x)=>x.productId!==exist.productId);
        }
        else{
            //decrease quantity
            (cart.items as CartItem[]).find((x)=>x.productId===productId)!.qty=exist.qty-1;
        }

        //update cart in database
        await prisma.cart.update({
            where:{id:cart.id},
            data:{
                items:cart.items as Prisma.CartUpdateitemsInput[],
                ...calcPrice(cart.items as CartItem[])
            }
        });

        //Revalidate product page
        revalidatePath(`/product/${product.slug}`);
        return {success:true,message:`${product.name} was removed from cart`};

    }catch(error){
        return {success:false,message:formatError(error)}
    }
}
/**File context

You’re defining server-side actions in Next.js 13+ ('use server'). These functions run only on the server (not in the browser). They handle cart operations (add item, fetch cart).

addItemToCart(data: CartItem)
1. Function call

Some client code calls:

await addItemToCart({ productId: "123", quantity: 2, ... })

2. Try-block begins

Everything runs inside try/catch for error handling.

3. Session Cart ID (cookie check)
const sessionCartId = (await cookies()).get('sessionCartId')?.value;


Reads cookies from the request.

Looks for a cookie called sessionCartId.

If not found → throw error "Cart Session not found" (stops execution).

4. Get user session
const session = await auth();
const userId = session?.user?.id ? (session.user.id as string) : undefined;


Calls your auth system.

If user is logged in → extract their userId.

If guest → userId = undefined.

5. Fetch existing cart
const cart = await getMyCart();


Calls getMyCart() (explained later).

Returns the cart object associated with this user/session.

If no cart exists, it may throw (if cookie missing) or return undefined.

6. Validate the item request
const item = cartItemSchema.parse(data);


Uses Zod schema (cartItemSchema) to validate incoming data.

If invalid → throws validation error.

If valid → returns a clean, type-safe item.

7. Look up product in DB
const product = await prisma.product.findFirst({
  where: { id: item.productId },
})


Checks if the product exists in your Product table.

If null → product not found. (Currently, you don’t throw for this, but maybe later you will).

8. Debug logging
console.log({
  'Session Cart ID': sessionCartId,
  'User ID': userId,
  'Item Requested': item,
  'Product Found': product,
})


Prints useful debugging info.

9. Return success

If no errors so far:

return {
  success: true,
  message: 'Item added to cart'
}


⚠️ Currently, you don’t actually insert into cart DB yet — just simulating.

10. Catch block

If any error was thrown earlier:

return {
  success: false,
  message: formatError(error)
}


Uses your custom formatError helper to make a readable error message.

getMyCart()

This is the helper used in addItemToCart.

1. Get session cart ID
const sessionCartId = (await cookies()).get('sessionCartId')?.value;
if (!sessionCartId) throw new Error('Cart Session not found');


Same cookie check as before.

2. Get user session
const session = await auth();
const userId = session?.user?.id ? (session.user.id as string):undefined;


Identifies whether the cart should be fetched by userId (if logged in) or sessionCartId (guest).

3. Query database
const cart = await prisma.cart.findFirst({
  where: userId ? { userId: userId } : { sessionCartId: sessionCartId }
});


If logged in → look for cart tied to userId.

If guest → look for cart tied to sessionCartId.

4. Handle missing cart
if (!cart) return undefined;

5. Convert and return
return convertToPlainObject({
  ...cart,
  items: cart.items as CartItem[],
  itemsPrice: cart.itemsPrice.toString(),
  totalPrice: cart.totalPrice.toString(),
  shippingPrice: cart.shippingPrice.toString(),
  taxPrice: cart.taxPrice.toString(),
})


Converts DB object (with Prisma Decimal types) into plain JS-safe JSON.

Converts all money fields (itemsPrice, totalPrice, etc.) to strings (to avoid precision loss in JSON).

Execution Flow (End-to-End)

User clicks "Add to Cart" → calls addItemToCart(data).

Server checks cookie (sessionCartId).

Auth check (user or guest).

Loads the cart with getMyCart().

Validates request with Zod schema.
Confirms product exists in DB.

Logs debug info.

Returns success (though actual DB insert logic is still missing).

If error → formats & returns error response.

👉 So right now, your code is scaffolding for a cart system. It validates requests, ensures session/user identity, and queries DB — but doesn’t yet add the item to the cart table. */

/**######################################################################################################################################## */


/**FULL CODE EXPLANATION */



/*Purpose

Server actions to add an item to a user's cart and to fetch the current cart. Runs on the server ('use server'), uses cookies + auth + Prisma, validates with Zod, calculates prices, and revalidates the product page cache.

Execution flow (call: await addItemToCart(data))

Function entry
addItemToCart(data: CartItem) is called on the server with the item payload.

Read session cookie
const sessionCartId = (await cookies()).get('sessionCartId')?.value;

If missing → throw new Error('Cart Session not found') → caught later.

Get auth session
const session = await auth();
const userId = session?.user?.id ? (session.user.id as string) : undefined;

If user logged in, userId set; else undefined.

Load current cart
const cart = await getMyCart();
(see getMyCart flow below — note: this re-reads the cookie and auth again.)

Validate incoming item
const item = cartItemSchema.parse(data);

Zod validation; on failure it throws (caught later).

Load product from DB
const product = await prisma.product.findFirst({ where: { id: item.productId } });

If !product → throw new Error('Product not found').

Branch — cart does not exist (!cart)
a. Build newCart object:
insertCartSchema.parse({ sessionCartId, userId, items: [item], ...calcPrice([item]) })

Zod parse ensures DB shape & types.
b. Insert to DB: await prisma.cart.create({ data: newCart }).
c. Revalidate cache: revalidatePath(/product/${product.slug}).
d. Return success { success:true, message: ${product.name} Item added to cart }.
Note: the console.log(...) after this return is unreachable code (won’t execute).

Branch — cart exists
a. Find if item already in cart:
const existItem = (cart.items as CartItem[]).find(x => x.productId === item.productId);
b. If existItem (same product already in cart):

Check stock: if (product.stock < existItem.qty + 1) throw new Error('Not Enough stock').

Increment quantity: set that item’s qty = existItem.qty + 1.
c. Else (new product for this cart):

Check stock: if (product.stock < 1) throw new Error('Not Enough stock').

cart.items.push(item).
d. Persist updated cart:
await prisma.cart.update({ where: { id: cart.id }, data: { items: cart.items as Prisma.CartUpdateitemsInput[], ...calcPrice(cart.items as CartItem[]) } });
e. Revalidate cache and return success message: message uses existItem ? 'Updated item in' : 'Added to'.

Catch block (global)
Any throw in the try is caught → return { success:false, message: formatError(error) }.

getMyCart() flow (called from step 4)

Read cookie: sessionCartId = (await cookies()).get('sessionCartId')?.value; → throw if missing.

const session = await auth(); const userId = session?.user?.id ...

Query DB:
const cart = await prisma.cart.findFirst({ where: userId ? { userId } : { sessionCartId } });

If no cart → return undefined.

If found → return convertToPlainObject({ ...cart, items: cart.items as CartItem[], itemsPrice: cart.itemsPrice.toString(), ... })

Converts Prisma Decimal → strings and returns plain JSON-friendly object.

What calcPrice does (quick)

Sums price * qty, rounds using round2, computes shipping (0 if >100 else 10), tax 15%, total, then returns all four as strings with 2 decimals (toFixed(2)).

Quick examples (path examples)

Guest, no cart → cookie present, getMyCart() returns undefined → new cart.create() with one item → revalidate → success.

Logged-in with cart, same product present → existItem found → stock check → qty incremented → cart.update() → revalidate → success.*/