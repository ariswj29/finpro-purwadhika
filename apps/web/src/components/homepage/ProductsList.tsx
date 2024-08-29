'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { getAllProducts } from '@/api/products';
import { formattedMoney } from '@/helper/helper';
import { addCart } from '@/api/cart';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function ProductsList(props: any) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchProductList = async (limit = 8) => {
    setLoading(true);
    try {
      const response = await getAllProducts(limit);

      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToCart = (id: number) => {
    const res = addCart(id, 7);
    showToast('Item added to cart');
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 50000);
  };

  useEffect(() => {
    fetchProductList();
  }, []);

  return (
    <div className="container mx-auto px-8 py-12 bg-primary">
      {toastVisible && (
        <div
          className="toast toast-top toast-end"
          style={{
            position: 'fixed',
            top: '3rem',
            right: '1rem',
            zIndex: 1000,
          }}
        >
          <div className="alert alert-info">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-4">OUR PRODUCTS</h1>
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
                <Image
                  src={`http://localhost:8000/products/${product.image}`}
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
                <button
                  className="bg-black text-white px-4 py-1 my-2 rounded-md hover:font-bold"
                  onClick={() => handleAddToCart(product.id)}
                >
                  Add to Cart
                </button>
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
