'use client';

import { getAllCart, removeCart } from '@/api/cart';
import { CartItem } from '@/interface/cart.interface';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchCart = async () => {
      const res = await getAllCart();
      setCart(res.data);
    };

    fetchCart();
  }, []);

  const handleQuantityChange = (index: number, newQuantity: number) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = newQuantity;
    setCart(updatedCart);
  };

  const handleRemoveCart = async (id: number) => {
    const res = await removeCart(id);
    const data = await res;

    if (data.status === 'success') {
      const updatedCart = cart.filter((item) => item.id !== id);
      setCart(updatedCart);
    } else {
      alert('Failed to remove cart');
    }
  };

  return (
    <section className="p-12 max-w-screen-xl mx-auto items-center">
      <h3 className="text-3xl font-bold mb-8 text-center">Shopping Cart</h3>
      <table className="w-full">
        <thead>
          <tr className="text-left">
            <th>No</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, index) => (
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
              <td>
                <input
                  type="number"
                  className="w-16 rounded-xl text-center"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(index, Number(e.target.value))
                  }
                />
              </td>
              <td>Rp. {item.product.price * item.quantity}</td>{' '}
              <td>
                <button
                  className="px-3 py-1 border border-solid border-secondary rounded-2xl hover:font-bold"
                  onClick={() => handleRemoveCart(item.id)}
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
