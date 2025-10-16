'use server';

import { shippingAddressSchema, signInFormSchema,signUpFormSchema } from "../validators";

import {auth, signIn} from "@/auth"//this is coming from nextauth

// import { signOut } from "next-auth/react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
import { ShippingAddress } from "@/types";

//Sign in the user with credentials
export async function signInWithCredentials(prevState:unknown,formData:FormData){
    try{
      const user = signInFormSchema.parse({
        email:formData.get('email'),
        password:formData.get('password')
      });

      await signIn('credentials',user);

      return {success:true,message:'Signed in successfully'}

    }catch(error){
       if(isRedirectError(error)){
        throw error;
       }

       return{success:false,message:'Invalid email or password'}

    }

}

//Sign user out

// export async function signOutUser(){
//     await signOut();
// }

//Sign up user
export async function signUpUser(prevState:unknown,formData:FormData){
  try{
    const user = signUpFormSchema.parse({
      name:formData.get('name'),
      email:formData.get('email'),
      password:formData.get('password'),
      confirmPassword:formData.get('confirmPassword'),

    });

    const plainPassword = user.password;

    user.password = hashSync(user.password,10);
    await prisma.user.create({
      data:{
        name: user.name,
        email: user.email,
        password: user.password
      },
    });

    await signIn('credentials',{
      email:user.email,
      password:plainPassword

    });

    return{success:true,message:'User registered successfully'}
  }
  catch(error){
    // console.log(error.name),
    // console.log(error.code),
    // console.log(error.issues),
    // console.log(error.meta?.target);
    if(isRedirectError(error)){
        throw error;
       }

       const friendlyMessage = await formatError(error); 
      return { success: false, message: friendlyMessage };



  }

}

//Get user by ID
export async function getUserById(userId:string){
  const user = await prisma.user.findFirst({
    where:{id:userId}
  });
  if(!user)throw new Error('User not found');
  return user;

}


//update the user's address
export async function updateUserAddress(data:ShippingAddress){
  try{
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where:{id:session?.user?.id}

    });

    if(!currentUser) throw new Error('User not found');
    
    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where:{id:currentUser.id},
      data:{address}
    });

    return {
      success:true,
      message:'User updated successfully',
    }

  }catch(error){
    return {success:false,message:formatError(error)}
  }
}

/**signInFormSchema → a Zod schema you made for validation. Ensures email and password are present and valid types.

signIn & signOut → NextAuth helpers. These trigger login/logout flows.

isRedirectError → Next.js utility to detect when signIn() internally tries to redirect (NextAuth uses redirects for auth flow).


Form submitted → formData contains { email, password }.

Validation with Zod → ensures required fields and proper format.

If invalid, Zod throws → caught in catch → returns { success:false }.

Calls signIn('credentials', user) → NextAuth checks your DB:

Finds user by email.

Compares bcrypt.compare(password, user.passwordHash).

If match → logged in, session created.

If mismatch → NextAuth throws.

If login works → return { success:true }.

If login fails → catch returns { success:false, message:'Invalid email or password' }.

Simple wrapper that calls NextAuth’s signOut.

Why: lets you attach this function directly to a <form action={signOutUser}> in client code.*/