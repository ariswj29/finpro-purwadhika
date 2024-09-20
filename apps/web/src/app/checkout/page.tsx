'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { formattedMoney, getCookies, totalPrice } from '@/helper/helper';
import { getCart } from '@/api/cart';
import { CartItem } from '@/interface/cart.interface';
import Image from 'next/image';
import SelectOption from '@/components/SelectOption';
import { banks, couriers } from '@/data/data';
import { getAddress } from '@/api/address';
import { createOrder } from '@/api/order';
import { getBranch } from '@/api/branch';
import { calShippingCost } from '@/api/checkout';
import NotificationToast from '../../components/NotificationToast';

export default function CheckoutPage(context: any) {
  const cookies = getCookies();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [address, setAddress] = useState<{ id: number; cityId: string }[]>([]);
  const [branch, setBranch] = useState<{ cityId: string } | null>(null);
  const [shippingCost, setShippingCost] = useState({ data: [{ value: 0 }] });
  const [addAddress, setAddAddress] = useState(false);
  const [notif, setNotif] = useState<{ message: string; status: string }>({
    message: '',
    status: '',
  });

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const selectedCourier = watch('courier');
  const selectedAddress = watch('addressId');

  useEffect(() => {
    const fetchCart = async () => {
      const res = await getCart(Number(cookies.userId));
      setCart(res.data);
    };
    const fetchBranch = async () => {
      const res = await getBranch(Number(cookies.nearestBranch));
      setBranch(res.data);
    };

    const fetchAddress = async () => {
      try {
        const res = await getAddress(Number(cookies.userId));
        setAddress(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCart();
    fetchBranch();
    fetchAddress();
  }, [cookies.nearestBranch, cookies.userId]);

  useEffect(() => {
    const calculateShippingCost = async (cityId: string, courier: string) => {
      try {
        const response = await calShippingCost({
          courier,
          destination: cityId,
          origin: branch?.cityId || '',
          weight: 1000,
        });
        setShippingCost(response);
      } catch (error) {
        console.error('Error calculating shipping cost:', error);
        setShippingCost({ data: [{ value: 0 }] });
      }
    };

    if (selectedAddress !== 'Pick one' && selectedCourier !== 'Pick one') {
      const selectedAddressObj = address.find(
        (addr) => addr.id === Number(selectedAddress),
      );

      if (selectedAddressObj) {
        calculateShippingCost(selectedAddressObj.cityId, selectedCourier);
      }
    }
  }, [selectedCourier, selectedAddress, address, branch?.cityId]);

  const handleCheckout = async (formData: any) => {
    const data = {
      paymentMethod: formData.paymentMethod,
      courier: formData.courier,
      userId: Number(cookies.userId),
      branchId: Number(cookies.nearestBranch),
      addressId: Number(formData.addressId),
      cart: cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        total: item.product.price * item.quantity,
      })),
      shippingCost: shippingCost?.data[0].value,
      total:
        cart.reduce((a, b) => a + b.product.price * b.quantity, 0) +
        shippingCost?.data[0].value,
    };

    console.log(data, 'data');
    const response = await createOrder(data);
    if (response) {
      showToast(response);
      setTimeout(() => {
        window.location.href = '/profile/order-list';
      }, 3000);
    }
  };

  const showToast = (data: { message: string; status: string }) => {
    setNotif(data);
    setTimeout(() => {
      setNotif({ message: '', status: '' });
    }, 3000);
  };

  return (
    <div className="container max-w-screen-xl mx-auto items-center p-12">
      <NotificationToast toastMessage={notif} />
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Checkout
        </h3>
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
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}/products/${item.product.image}`}
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
        <div className="grid md:grid-cols-5 grid-cols-1 gap-4">
          {/* Cart */}
          <div className="grid md:col-span-5 overflow-x-auto">
            <table className="w-full min-w-[600px] table-auto border-collapse">
              {/* ... table code */}
            </table>
          </div>

          {/* Forms */}
          <div className="md:col-span-3 order-1 md:order-1">
            <form>
              <SelectOption
                label="Select Address"
                field="addressId"
                options={address}
                register={register}
              />
              <SelectOption
                label="Select Payment Method"
                field="paymentMethod"
                options={banks}
                register={register}
              />
              <SelectOption
                label="Select Courier"
                field="courier"
                options={couriers}
                register={register}
              />
            </form>
          </div>

          {/* Summary */}
          <div className="mt-4 px-8 md:col-span-2 order-2 md:order-1">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Summary</h3>
              {/* Subtotal */}
              <div className="flex justify-between my-2">
                <span>Subtotal</span>
                <span>
                  {formattedMoney(
                    cart
                      ? cart.reduce(
                          (a, b) => a + b.product.price * b.quantity,
                          0,
                        )
                      : 0,
                  )}
                </span>
              </div>

              {/* Shipping Cost */}
              <div className="flex justify-between my-2">
                <span>Shipping Cost</span>
                <span>
                  {formattedMoney(
                    typeof shippingCost === 'number'
                      ? shippingCost
                      : shippingCost?.data[0].value,
                  )}
                </span>
              </div>

              {/* Total */}
              <div className="flex justify-between my-2 pt-2 border-t-2 border-t-slate-700 border-t-solid">
                <span className="font-bold">Total</span>
                <span className="font-bold">
                  {totalPrice(
                    cart.reduce((a, b) => a + b.product.price * b.quantity, 0),
                    typeof shippingCost === 'number'
                      ? shippingCost
                      : shippingCost?.data[0].value,
                  )}
                </span>
              </div>

              <a onClick={handleSubmit(handleCheckout)}>
                <div className="cursor-pointer bg-secondary rounded-3xl my-4 py-2 px-4 text-center hover:font-bold">
                  Checkout
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
