import ProductList from "@/components/shared/product/product-list"
import { getLatestProducts ,getFeaturedProducts} from "@/lib/actions/product.actions";
import IconBoxes from "@/components/icon-boxes";
import DealCountdown from "@/components/deal-countdown";
import ProductCarousel from "@/components/shared/product/product-carousel";
import Image from "next/image";
export const metadata={
  title:'Home'
}
const HomePage = async() => {
  const latestProducts = await getLatestProducts();
  const featuredProducts=await getFeaturedProducts();

  return ( 
    <>
      {featuredProducts.length > 0 && <ProductCarousel data={featuredProducts} />}
      <ProductList data={latestProducts} title='Newest Arrivals' />
      <Image src='https://res.cloudinary.com/dqxhjnhrt/image/upload/v1758865410/Gemini_Generated_Image_ug7j3dug7j3dug7j_tvg2re.png' alt="deal-image" width={1500} height={300} />
      <DealCountdown />
      <IconBoxes />
    </>
  );
}
 
export default HomePage;

