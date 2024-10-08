'use client';

import { addCart } from '@/api/cart';
import { getWishlist, removeWishlist } from '@/api/wishlist';
import NotificationToast from '@/components/NotificationToast';
import { getCookies } from '@/helper/helper';
import { WishlistItem } from '@/interface/wishlist.interface';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Wishlist() {
  const cookies = getCookies();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState<{ message: string; status: string }>({
    message: '',
    status: '',
  });

  useEffect(() => {
    const fetchWishlist = async () => {
      const res = await getWishlist(Number(cookies.userId));
      setWishlist(res.data);
    };

    if (cookies.token && cookies.userId) {
      fetchWishlist();
    }
    setLoading(false);
  }, [cookies.token, cookies.userId]);

  const handleRemoveWishlist = async (id: number) => {
    const res = await removeWishlist(id);
    setWishlist(wishlist.filter((item) => item.id !== id));
    showToast(res);
  };

  const handleAddToCart = async (id: number) => {
    if (cookies.token && cookies.userId) {
      const res = await addCart(id, Number(cookies.userId));
      showToast(res);
    } else {
      showToast({ message: 'Please login first!', status: 'error' });
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
      <h3 className="text-3xl font-bold mb-8 text-center">My Wishlist</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] table-auto border-collapse">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="p-2">No</th>
              <th className="p-2">Product</th>
              <th className="p-2">Price</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="skeleton h-32 text-center p-4 font-bold"
                >
                  Loading...
                </td>
              </tr>
            ) : wishlist.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-4 font-bold">
                  No item in wishlist
                </td>
              </tr>
            ) : (
              wishlist.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">
                    <div className="flex items-center">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/products/${item.product.image}`}
                        alt="Product"
                        width={80}
                        height={80}
                        className="mr-2"
                      />
                      {item.product.name}
                    </div>
                  </td>
                  <td className="p-2">Rp. {item.product.price}</td>
                  <td className="p-2">
                    <button
                      className="px-3 py-1 mb-2 sm:mb-0 sm:mr-2 border border-solid bg-secondary rounded-2xl hover:font-bold"
                      onClick={() => handleAddToCart(item.product.id)}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="px-3 py-1 border border-solid border-secondary rounded-2xl hover:font-bold"
                      onClick={() => handleRemoveWishlist(item.id)}
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
    </section>
  );
}
