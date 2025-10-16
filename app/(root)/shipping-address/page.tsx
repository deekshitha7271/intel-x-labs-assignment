import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.actions";
import { Metadata } from "next";
import {redirect} from 'next/navigation';
import { ShippingAddress } from "@/types";
import { getUserById } from "@/lib/actions/user.actions";
import ShippingAddressForm from "./shipping-address-form";
import CheckoutSteps from "@/components/shared/product/checkout-steps";
export const metadata:Metadata={
    title:'Shipping Address'
}
const ShippingAddressPage = async() => {
    // const cart =await getMyCart();
    // if(!cart||cart.items.length===0)redirect('/cart');
    // const session = await auth();
    // const userId=session?.user?.id;
    // if(!userId) throw new Error('No user ID');

    // const user = await getUserById(userId);
      const session = await auth();
  if (!session?.user?.id) redirect('/sign-in');  // ✅ check first

  const cart = await getMyCart(); // ✅ call only for logged user
  if (!cart || cart.items.length === 0) redirect('/cart');

  const user = await getUserById(session.user.id);




    return ( 
    <>
    <CheckoutSteps current={1}/>
    <ShippingAddressForm address={user.address as ShippingAddress}/>
    </> );
}
 
export default ShippingAddressPage;