'use client';

import { getAllWishlist } from '@/api/wishlist';
import { WishlistItem } from '@/interface/wishlist.interface';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      const res = await getAllWishlist();
      setWishlist(res.data);
    };

    fetchWishlist();
  }, []);

  return (
    <section className="p-12 max-w-screen-xl mx-auto items-center">
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
              <td>Rp. {item.product.price}</td>{' '}
              <td>
                <button
                  className="px-3 py-1 mr-2 border border-solid bg-secondary rounded-2xl hover:font-bold"
                  // onClick={() => handleRemoveCart(item.id)}
                >
                  Add to Cart
                </button>
                <button
                  className="px-3 py-1 border border-solid border-secondary rounded-2xl hover:font-bold"
                  // onClick={() => handleRemoveCart(item.id)}
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
