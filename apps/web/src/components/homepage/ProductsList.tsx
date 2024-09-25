'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { getAllProducts } from '@/api/products';
import { formattedMoney, getCookies } from '@/helper/helper';
import { Product } from '@/interface/product.interface';
import Cookies from 'js-cookie';

export default function ProductsList(props: any) {
  const cookies = getCookies();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProductList = async (limit = 8) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          Cookies.set('latitude', latitude.toString(), {
            expires: 1,
            secure: true,
          });
          Cookies.set('longitude', longitude.toString(), {
            expires: 1,
            secure: true,
          });
          try {
            const response = await getAllProducts(limit, latitude, longitude);
            setProducts(response.data);
            setLoading(false);
            Cookies.set('nearestBranch', response.nearestBranch, {
              expires: 1,
              secure: true,
            });
          } catch (error) {
            console.error(error);
          }
        },
        async () => {
          // Jika akses lokasi gagal, ambil data produk tanpa parameter lokasi
          try {
            const response = await getAllProducts(limit);
            setProducts(response.data);
            setLoading(false);
          } catch (error) {
            console.error(error);
          }
        },
      );
    } else {
      // Jika geolocation tidak tersedia, ambil data produk tanpa parameter lokasi
      try {
        const response = await getAllProducts(limit);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchProductList();
  }, []);

  return (
    <div className="container mx-auto px-8 py-12 bg-primary">
      <h1 className="text-4xl font-bold mb-10 text-center">
        BEST SELLER PRODUCTS
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 cursor-pointer">
        {loading ? (
          <span className="p-2 font-bold">Loading...</span>
        ) : products.length === 0 ? (
          <span className="p-2 font-bold">Data not found!</span>
        ) : (
          products.map((product) => {
            return (
              <div
                key={product.id}
                className="p-4 bg-white hover:bg-secondary shadow-lg rounded-lg border-2 border-secondary transform transition-transform duration-300 hover:scale-105"
              >
                <Link href={`/products/${product.slug}`}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}/products/${product.image}`}
                    alt={product.name}
                    className="bg-gray-200 rounded-lg h-48 w-full object-cover"
                    width={500}
                    height={500}
                  />
                  <h2 className="text-xl font-semibold pt-4 text-black">
                    {product.name}
                  </h2>
                  <p className="text-gray-600">
                    {formattedMoney(product.price ?? 0)}
                  </p>
                  <p className="text-gray-600">
                    Stock: {product.totalStock || 0}
                  </p>
                </Link>
              </div>
            );
          })
        )}
      </div>
      <Link href={'/products'}>
        <button className="bg-secondary rounded-xl py-2 my-9 text-center w-full font-bold hover:font-extrabold">
          All Products
        </button>
      </Link>
    </div>
  );
}
