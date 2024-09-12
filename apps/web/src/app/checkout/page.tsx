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
import AddAddress from '@/components/AddAdress';
import { createOrder } from '@/api/order';
import { getBranch } from '@/api/branch';
import { calShippingCost } from '@/api/checkout';

export default function CheckoutPage(context: any) {
  const cookies = getCookies();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [address, setAddress] = useState([]);
  const [branch, setBranch] = useState([]);
  const [shippingCost, setShippingCost] = useState(0); // State untuk menyimpan biaya pengiriman
  console.log(shippingCost, 'ship');
  const [addAddress, setAddAddress] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    message: string;
    status: string;
  }>({
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

  const selectedCourier = watch('courier'); // Watch untuk courier
  const selectedAddress = watch('addressId'); // Watch untuk address

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
  }, []);

  // Fungsi untuk menghitung biaya pengiriman
  const calculateShippingCost = async (cityId: string, courier: string) => {
    try {
      const response = await calShippingCost({
        courier,
        destination: cityId,
        origin: branch.cityId, // Menggunakan cityId dari branch
        weight: 1000, // Berat dummy, bisa disesuaikan
      });
      setShippingCost(response); // Simpan biaya pengiriman ke state
    } catch (error) {
      console.error('Error calculating shipping cost:', error);
      setShippingCost(0); // Set shipping cost ke 0 jika gagal
    }
  };

  // Checkout page
  useEffect(() => {
    if (selectedCourier && selectedAddress) {
      const selectedAddressObj = address.find(
        (addr) => addr.id === Number(selectedAddress),
      );
      if (selectedAddressObj) {
        // Use the cityId from the selected address to calculate shipping
        calculateShippingCost(selectedAddressObj.cityId, selectedCourier);
      }
    }
  }, [selectedCourier, selectedAddress, address]);

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
      shippingCost, // Gunakan biaya pengiriman dari state
      total:
        cart.reduce((a, b) => a + b.product.price * b.quantity, 0) +
        shippingCost,
    };

    console.log(data, 'data');
    const response = await createOrder(data);
    if (response) {
      showToast(response);
      reset();
      window.location.href = '/profile/order-list';
    }
  };

  const showToast = (data: { message: string; status: string }) => {
    setToastMessage(data);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  return (
    <div className="container max-w-screen-xl mx-auto items-center p-12">
      {/* Toast */}
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
                <span>{formattedMoney(shippingCost?.data[0].value)}</span>
              </div>

              {/* Total */}
              <div className="flex justify-between my-2 pt-2 border-t-2 border-t-slate-700 border-t-solid">
                <span className="font-bold">Total</span>
                <span className="font-bold">
                  {formattedMoney(
                    cart.reduce((a, b) => a + b.product.price * b.quantity, 0) +
                      shippingCost?.data[0].value,
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
