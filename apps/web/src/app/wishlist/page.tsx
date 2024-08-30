'use client';

import { addCart } from '@/api/cart';
import { getAllWishlist, removeWishlist } from '@/api/wishlist';
import { WishlistItem } from '@/interface/wishlist.interface';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    message: string;
    status: string;
  }>({ message: '', status: '' });

  useEffect(() => {
    const fetchWishlist = async () => {
      const res = await getAllWishlist();
      setWishlist(res.data);
    };

    fetchWishlist();
  }, []);

  const handleRemoveWishlist = async (id: number) => {
    const res = await removeWishlist(id);
    setWishlist(wishlist.filter((item) => item.id !== id));
    console.log(res, 'Item removed from wishlist');
    showToast(res);
  };

  const handleAddToCart = async (id: number) => {
    const res = await addCart(id, 7);
    showToast(res);
  };

  const showToast = (data: { message: string; status: string }) => {
    setToastMessage(data);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  return (
    <section className="p-12 max-w-screen-xl mx-auto items-center">
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
          <div
            className={`alert ${toastMessage.status === 'success' ? 'alert-success' : 'alert-error'}`}
          >
            <span className="text-primary text-bold">
              {toastMessage.message}
            </span>
          </div>
        </div>
      )}

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
            {wishlist.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">
                  <div className="flex items-center">
                    <Image
                      src={`http://localhost:8000/products/${item.product.image}`}
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
                    onClick={() => handleAddToCart(item.id)}
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
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
