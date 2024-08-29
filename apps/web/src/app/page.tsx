import ProductsList from '@/components/homepage/ProductsList';
import AboutUs from '@/components/homepage/AboutUs';
import Slider from '@/components/homepage/Slider';

export default function Home() {
  return (
    <>
      <Slider />
      <AboutUs />
      <ProductsList />
    </>
  );
}
