import Image from 'next/image';
import styles from './page.module.css';
import Slider from '@/components/homepage/slider';
import ProductsList from '@/components/homepage/ProductsList';
import AboutUs from '@/components/homepage/AboutUs';

export default function Home() {
  return (
    <>
      <Slider />
      <AboutUs />
      <ProductsList />
    </>
  );
}
