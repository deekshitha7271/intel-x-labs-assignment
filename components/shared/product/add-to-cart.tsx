
'use client'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Cart, CartItem } from "@/types"
import { toast } from "sonner"           // only sonner
import { Plus ,Minus,Loader} from "lucide-react";

// import { Toaster } from "@/components/ui/sonner"
import { addItemToCart } from "@/lib/actions/cart.actions";
import { removeItemFromCart } from "@/lib/actions/cart.actions"
import { useTransition } from "react"

const AddToCart = ({ cart, item }: { cart?: Cart, item: CartItem }) => {
  const router = useRouter()
  const [isPending,startTransition]=useTransition();

  const handleAddToCart = async () => {
    startTransition(async ()=>{
      const res = await addItemToCart(item)

    if (!res.success) {
      toast.error(res.message || "Something went wrong")
      return
    }

    //Sonner supports a React node in the message, so we can render a button
    toast.success(
      <div className="flex items-center gap-2">
        <span>{res.message}</span>
        <button
          className="bg-primary text-white px-2 py-1 rounded hover:bg-gray-800"
          onClick={() => router.push("/cart")}
        >
          Go To Cart
        </button>
      </div>
    )
    })
    
  };

  //Handle remove from cart
  const handleRemoveFromCart = async() => {
    startTransition(async ()=>{
      const res = await removeItemFromCart(item.productId);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    return;
    })
    
  }


  //Check if item is in cart
  const existItem = cart && cart.items.find((x)=>x.productId===item.productId);
  
  return existItem ? (<div>
    <Button type='button' variant='outline' onClick={handleRemoveFromCart}>
      {isPending ? <Loader className="h-4 w-4 animate-spin"/> : <Minus className="h-4 w-4"/>}

    </Button>
    <span className="px-2">{existItem.qty}</span>
    <Button type='button' variant='outline' onClick={handleAddToCart}>
      {isPending ? <Loader className="h-4 w-4 animate-spin"/> : <Plus className="h-4 w-4"/>}
    </Button>

  </div>) : (<Button className="w-full" type="button" onClick={handleAddToCart}>
        {isPending ? <Loader className="h-4 w-4 animate-spin"/> : <Plus className="h-4 w-4"/>} Add To Cart
      </Button>
      )
}

export default AddToCart




// 'use client';
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/router";
// import { CartItem } from "@/types";
// import { Plus } from "lucide-react";
// import { toast } from "sonner";
// import { Toaster } from "@/components/ui/sonner";
// import { addItemToCart } from "@/lib/actions/cart.actions";
// const AddToCart = ({item}:{item:CartItem}) => {
//     const router = useRouter();
//     const handleAddToCart = async () => {
//         try {
//       const res = await addItemToCart(item);

//       if (!res.success) {
//         toast.error(res.message || "Something went wrong"); // ❌ error toast
//         return;
//       }

      
//       toast.success(`${item.name} added to cart`, {
//         action: {
//           label: "Go",
//           onClick: () => router.push("/cart"),
//         },
//       });
//     } catch (err) {
//       toast.error("Unexpected error occurred");
//     }
//     }
//     return ( <Button className="w-full" type='button' onClick={handleAddToCart}>Add To Cart</Button> );
// }
 
// export default AddToCart;

