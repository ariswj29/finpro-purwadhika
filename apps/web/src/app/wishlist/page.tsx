'use client';

import { addCart } from '@/api/cart';
import { getAllWishlist, removeWishlist } from '@/api/wishlist';
import { WishlistItem } from '@/interface/wishlist.interface';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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
    showToast('Item removed from wishlist');
  };

  const handleAddToCart = (id: number) => {
    const res = addCart(id, 7);
    console.log(res, 'Item added to cart');
    showToast('Item added to cart');
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

      <h3 className="text-3xl font-bold mb-8 text-center">My Wishlist</h3>
      <table className="w-full">
        <thead>
          <tr className="text-left">
            <th>No</th>
            <th>Product</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {wishlist.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <div className="flex items-center">
                  <Image
                    src={`http://localhost:8000/products/${item.product.image}`}
                    alt="Product"
                    width={150}
                    height={150}
                  />
                  {item.product.name}
                </div>
              </td>
              <td>Rp. {item.product.price}</td>
              <td>
                <button
                  className="px-3 py-1 mr-2 border border-solid bg-secondary rounded-2xl hover:font-bold"
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
    </section>
  );
}
