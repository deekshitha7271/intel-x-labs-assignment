'use client'
import Link from "next/link";
import Image from "next/image";
import { Card,CardContent,CardHeader } from "@/components/ui/card";
import ProductPrice from "./product-price";
import {Product} from '@/types'
import {motion} from 'framer-motion'

const MotionCard = motion(Card);
const MotionImage = motion(Image);

const ProductCard = ({product}:{product:Product}) => {

    return ( <MotionCard className="relative overflow-hidden rounded-2xl group shadow-sm"
    //   initial={{ opacity: 0, y: 50 }}
    //   whileInView={{ opacity: 1, y: 0 }}
    //   transition={{ duration: 0.6, ease: "easeOut" }}
    //   viewport={{ once: true, amount: 0.2 }}
       initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  viewport={{ once: true }}>
        <CardHeader className="p-0 items-center">
            <Link href={`/products/${product.slug}`}>
            <MotionImage src={product.images[0]}
            alt={product.name}
            height={300}
            width={300}
            priority={true}
            className="rounded-t-2xl object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        />
            </Link>
        </CardHeader>
        <CardContent className='p-4 grid gap-4'>
            <div className="text-xs">{product.brand}</div>
            <Link href={`/product/${product.slug}`}>
                <h2 className="text-sm font-medium">{product.name}</h2>
            </Link>
            <div className="flex-between gap-4">
                <p>{product.rating} Stars</p>
                {product.stock>0?(<ProductPrice value={Number(product.price)} className="text-red-500"/>):(<p className="text-destructive">Out of Stock</p>)}
            </div>
        </CardContent>
    </MotionCard> );
}
 
export default ProductCard;

//w-full max-w-sm