'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { formattedMoney, totalPrice } from '@/helper/helper';
import { getAllCart } from '@/api/cart';
import { CartItem } from '@/interface/cart.interface';
import Image from 'next/image';
import SelectOption from '@/components/SelectOption';
import { banks, couriers } from '@/data/data';
import { getAddress } from '@/api/address';
import AddAddress from '@/components/AddAdress';

export default function CheckoutPage(context: any) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [address, setAddress] = useState([]);
  const [addAddress, setAddAddress] = useState(false);
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchCart = async () => {
      const res = await getAllCart();
      setCart(res.data);
    };

    const fetchAddress = async () => {
      try {
        const res = await getAddress(7);
        console.log(res.data, 'address');
        setAddress(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCart();
    fetchAddress();
  }, []);

  return (
    <div className="container max-w-screen-xl mx-auto items-center p-12">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Checkout
        </h3>
        <div className="grid md:grid-cols-5 grid-cols-1 gap-4">
          <div className="grid md:col-span-5  overflow-x-auto">
            <table className="w-full min-w-[600px] table-auto border-collapse">
              <thead>
                <tr className="text-left bg-gray-100">
                  <th className="p-2">No</th>
                  <th className="p-2">Product</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
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
                    <td className="p-2">{item.quantity}</td>
                    <td className="p-2">
                      {formattedMoney(item.product.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:col-span-3 order-1 md:order-1">
            <form>
              <SelectOption label="Select Address" options={address} />
              <div
                className="md:grid gap-4 py-2 tooltip"
                data-tip="Click if you not have any address or you want to add new address"
              >
                <a
                  className={`btn ${addAddress ? 'btn-error' : 'btn-info'}`}
                  onClick={() => setAddAddress(!addAddress)}
                >
                  {addAddress ? 'Cancel Add Address' : 'Add Address'}
                </a>
                {addAddress && <AddAddress setAddAddress={setAddAddress} />}
              </div>
              <SelectOption label="Select Payment Method" options={banks} />
              <SelectOption label="Select Courier" options={couriers} />
            </form>
          </div>
          <div className="mt-4 px-8 md:col-span-2 order-2 md:order-1">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Summary</h3>
              <div className="flex justify-between my-2">
                <span>Subtotal</span>
                <span>
                  {formattedMoney(
                    cart.reduce((a, b) => a + b.product.price, 0),
                  )}
                </span>
              </div>
              <div className="flex justify-between my-2">
                <span>Shipping Cost</span>
                <span>Rp. 10.000</span>
              </div>
              <div className="flex justify-between my-2 pt-2 border-t-2 border-t-slate-700 border-t-solid">
                <span className="font-bold">Total</span>
                <span className="font-bold">
                  {totalPrice(
                    cart.reduce((a, b) => a + b.product.price, 0),
                    10000,
                  )}
                </span>
              </div>
              <button className="bg-secondary rounded-3xl py-2 my-4 text-center w-full">
                <div className="px-4 text-center hover:font-bold">Checkout</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
