'use client'

import { Product } from "@/types";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const MotionImage = motion(Image);
const MotionHeading = motion.h2;

const ProductCarousel = ({ data }: { data: Product[] }) => {
  return (
    <Carousel
      className="w-full mb-12"
      opts={{ loop: true }}
      plugins={[
        Autoplay({
          delay: 3000,
          stopOnInteraction: true,
          stopOnMouseEnter: false,
        }),
      ]}
    >
      <CarouselContent>
        {data.map((product: Product) => (
          <CarouselItem key={product.id}>
            <Link href={`/products/${product.slug}`}>
              <motion.div
                className="relative mx-auto overflow-hidden rounded-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <MotionImage
                  src={product.banner!}
                  alt={product.name}
                  height={0}
                  width={0}
                  sizes="100vw"
                  className="w-full h-auto object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />

                {/* Floating Text Animation */}
                <div className="absolute inset-0 flex items-end justify-center">
                  <MotionHeading
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="bg-gray-900 bg-opacity-50 text-2xl font-bold px-2 text-white mb-6 rounded-md"
                  >
                    {product.name}
                  </MotionHeading>
                </div>
              </motion.div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>

      <motion.div whileHover={{ scale: 1.1 }}>
        <CarouselPrevious />
      </motion.div>

      <motion.div whileHover={{ scale: 1.1 }}>
        <CarouselNext />
      </motion.div>
    </Carousel>
  );
};

export default ProductCarousel;

// 'use client'

// import { Product } from "@/types";
// import { Carousel, CarouselContent, CarouselItem, CarouselPrevious,CarouselNext } from "@/components/ui/carousel";
// import Autoplay from 'embla-carousel-autoplay'
// import Link from "next/link";
// import Image from "next/image";
// const ProductCarousel = ({data}:{data:Product[]}) => {
//     return (<Carousel className='w-full mb-12' opts={{
//         loop:true
//     }}
//     plugins={[Autoplay({
//         delay:2000,
//         stopOnInteraction:true,
//         stopOnMouseEnter:true
//     })]}>
//         <CarouselContent>
//            {data.map((product:Product)=>(
//             <CarouselItem key={product.id}>
//                 <Link href={`/products/${product.slug}`}>
//                 <div className="relative mx-auto ">
                    
//                     <Image 
//                         src={product.banner! }
//                         alt={product.name} 
//                         height='0'
//                         width='0'
//                         sizes="100vw" 
//                         className="w-full h-auto" 
//                  />
                    
//                     <div className="absolute inset-0 flex items-end justify-center">
//                         <h2 className="bg-gray-900 bg-opacity-50 text-2xl font-bold px-2 text-white">
//                             {product.name}

//                         </h2>
//                     </div>
//                 </div>
//                 </Link>
//             </CarouselItem>))} 
//         </CarouselContent>
//         <CarouselPrevious/>
//         <CarouselNext/>
//     </Carousel> );
// }
 
// export default ProductCarousel;