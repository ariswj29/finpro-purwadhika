'use client';

import { addCart } from '@/api/cart';
import { getProductById } from '@/api/products';
import { addToWishlist } from '@/api/wishlist';
import NotificationToast from '@/components/NotificationToast';
import { formattedMoney, getCookies } from '@/helper/helper';
import { Product } from '@/interface/product.interface';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Params {
  slug: string;
}

export default function ProductDetail({ params }: { params: Params }) {
  const cookies = getCookies();
  const [product, setProduct] = useState<Product | null>(null);
  const [notif, setNotif] = useState<{ message: string; status: string }>({
    message: '',
    status: '',
  });

  const handleAddToCart = async (id: number) => {
    if (cookies.token && cookies.userId) {
      const res = await addCart(id, Number(cookies.userId));
      showToast(res);
    } else {
      showToast({ message: 'Please login first!', status: 'error' });
    }
  };

  const handleAddToWishlist = async (id: number) => {
    if (cookies.token && cookies.userId) {
      try {
        const response = await addToWishlist(id, Number(cookies.userId));
        showToast(response);
      } catch (error) {
        const axiosError = error as { response: { data: any } };
        showToast(axiosError.response?.data || error);
      }
    } else {
      showToast({ message: 'Please login first!', status: 'error' });
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(params.slug);
        setProduct(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, [params.slug]);

  const showToast = (data: { message: string; status: string }) => {
    setNotif(data);
    setTimeout(() => {
      setNotif({ message: '', status: '' });
    }, 3000);
  };

  return (
    <div className="max-w-screen-xl mx-auto my-16">
      <NotificationToast toastMessage={notif} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8">
        {/* Product Image */}
        <div className="flex justify-center">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/products/${product?.image}`}
            alt={product?.name || 'Product Name'}
            className="bg-gray-200 rounded-lg w-full h-96 object-cover"
            width={500}
            height={500}
          />
        </div>

        {/* Product Details */}
        <div className="space-y-2">
          <nav className="text-gray-500 font-semibold text-sm">
            <span className="text-secondary">
              <Link href="/">Home</Link>
            </span>
            <span> / </span>
            <span className="text-secondary">
              <Link href="/products">Product</Link>
            </span>
            <span> / </span>
            <span>{product?.slug}</span>
          </nav>
          <h1 className="text-3xl font-bold">
            {product?.name || 'Product Name'}
          </h1>
          <p className="text-xl text-gray-700 font-bold">
            {formattedMoney(product?.price || 0)}
          </p>
          <p className="text-base text-gray-600">
            Stock: <span className="font-bold">{product?.totalStock || 0}</span>
          </p>
          <p className="text-gray-600">
            Description:{' '}
            <span className="font-bold">
              {product?.description || 'Product Description'}
            </span>
          </p>

          <button
            className="bg-secondary rounded-xl py-2 my-9 text-center w-full font-bold hover:font-extrabold"
            onClick={() => product?.id && handleAddToCart(product.id)}
          >
            Add to cart
          </button>
          <button
            className="border-2 border-secondary rounded-xl py-2 my-9 text-center w-full font-bold hover:font-extrabold"
            onClick={() => product?.id && handleAddToWishlist(product.id)}
          >
            Add to wishlist
          </button>
        </div>
      </div>
    </div>
  );
}
