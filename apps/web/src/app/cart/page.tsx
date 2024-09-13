'use client';

import { getCart, updateCart } from '@/api/cart';
import { getCookies } from '@/helper/helper';
import { CartItem } from '@/interface/cart.interface';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Cart() {
  const cookies = getCookies();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchCart = async () => {
      const res = await getCart(Number(cookies.userId));
      setCart(res.data);
    };

    if (cookies.token && cookies.userId) {
      fetchCart();
    }
    setLoading(false);
  }, []);

  const handleQuantityChange = (index: number, newQuantity: number) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = newQuantity;
    setCart(updatedCart);
  };

  const handleRemoveCart = async (id: number) => {
    const res = await updateCart(id);
    const data = await res;

    if (data.status === 'success') {
      const updatedCart = cart.filter((item) => item.id !== id);
      setCart(updatedCart);
      showToast('Item removed from cart');
    } else {
      alert('Failed to remove cart');
      showToast('Failed to remove cart');
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  return (
    <section className="p-12 max-w-screen-xl mx-auto items-center">
      {toastVisible && (
        <div className="toast toast-top toast-end top-[3rem]">
          <div className="alert alert-info">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
      <h3 className="text-3xl font-bold mb-8 text-center">Shopping Cart</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] table-auto border-collapse">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="p-2">No</th>
              <th className="p-2">Product</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Total</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="skeleton h-32 text-center p-4 font-bold"
                >
                  Loading...
                </td>
              </tr>
            ) : cart.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4 font-bold">
                  No item in cart
                </td>
              </tr>
            ) : (
              cart.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">
                    <div className="flex items-center">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}/products/${item?.product?.image}`}
                        alt="Product"
                        width={80}
                        height={80}
                        className="mr-2"
                      />
                      {item?.product?.name}
                    </div>
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      className="w-16 rounded-xl text-center border border-solid border-gray-300"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(index, Number(e.target.value))
                      }
                    />
                  </td>
                  <td className="p-2">
                    Rp. {item?.product?.price * item?.quantity}
                  </td>
                  <td className="p-2">
                    <button
                      className="px-3 py-1 border border-solid border-secondary rounded-2xl hover:font-bold"
                      onClick={() => handleRemoveCart(item?.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {cart.length === 0 ? null : (
        <Link href={'/checkout'}>
          <button className="bg-secondary rounded-3xl py-4 my-8 text-center w-full">
            <div className="flex justify-between px-4">
              <span>
                Price:
                <span className="font-bold">
                  {' '}
                  Rp.{' '}
                  {cart.reduce(
                    (acc, item) => acc + item.product.price * item.quantity,
                    0,
                  )}
                </span>
              </span>
              <span className="font-bold">Checkout {'->'}</span>
            </div>
          </button>
        </Link>
      )}
    </section>
  );
}
