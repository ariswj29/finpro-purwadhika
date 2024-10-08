'use client';

import { getCart, updateCart, updateCartQuantity } from '@/api/cart';
import NotificationToast from '@/components/NotificationToast';
import { getCookies } from '@/helper/helper';
import { CartItem } from '@/interface/cart.interface';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Cart() {
  const router = useRouter();
  const cookies = getCookies();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState<{ message: string; status: string }>({
    message: '',
    status: '',
  });

  useEffect(() => {
    const fetchCart = async () => {
      const res = await getCart(Number(cookies.userId));
      setCart(res.data);
    };

    if (cookies.token && cookies.userId) {
      fetchCart();
    }
    setLoading(false);
  }, [cookies.token, cookies.userId]);

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
      showToast(res);
    } else {
      showToast({ message: 'Failed to remove cart!', status: 'error' });
    }
  };

  const checkout = async () => {
    const cartItems = cart.map((item) => ({
      id: item.id,
      product_id: item.product.id,
      quantity: item.quantity,
    }));

    try {
      await Promise.all(
        cartItems.map((item) => updateCartQuantity(item.id, item.quantity)),
      );

      showToast({
        message: 'Cart updated successfully and Ready to checkout!',
        status: 'success',
      });

      setTimeout(() => {
        router.push('/checkout');
      }, 3000);
    } catch (error) {
      showToast({ message: 'Failed to update cart!', status: 'error' });
    }
  };

  const showToast = (data: { message: string; status: string }) => {
    setNotif(data);
    setTimeout(() => {
      setNotif({ message: '', status: '' });
    }, 3000);
  };

  return (
    <section className="p-12 max-w-screen-xl mx-auto items-center">
      <NotificationToast toastMessage={notif} />
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
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/products/${item?.product?.image}`}
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
        <button
          className="bg-secondary rounded-3xl py-4 my-8 text-center w-full"
          onClick={checkout}
        >
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
      )}
    </section>
  );
}
