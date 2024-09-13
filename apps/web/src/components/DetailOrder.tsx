'use client';
import { getOrderDetail } from '@/api/order';
import { formattedDate, formattedMoney } from '@/helper/helper';
import { OrderDetail } from '@/interface/orderDetail.interface';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export const DetailOrder = (props: any) => {
  const [showModal, setShowModal] = useState(props.show);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<OrderDetail[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await getOrderDetail(props.order.id);
      setData(response.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const openPaymentProof = (image: string) => {
    window.open(
      `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/payments/${image}`,
      '_blank',
    );
  };

  return (
    showModal && (
      <div className="relative bg-white p-4 rounded-lg shadow-lg z-10">
        <h1 className="text-xl font-bold">Detail Order</h1>
        <table className="table w-[35rem]">
          <thead>
            <tr>
              <th>No</th>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="skeleton h-32 text-center p-4 font-bold"
                >
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-4 font-bold">
                  No detail order
                </td>
              </tr>
            ) : (
              data?.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td className="flex items-center">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}/products/${item.product.image}`}
                      width={75}
                      height={75}
                      alt="image product"
                    />
                    {item.product.name}
                  </td>
                  <td>{formattedMoney(item.product.price)}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-right">
                    {formattedMoney(item.product.price * item.quantity)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <hr className="my-2" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm">
              Number Order :{' '}
              <span className="font-semibold">{props.order.name}</span>
            </p>
            <p className="text-sm">
              Status Order :{' '}
              <span className="font-semibold">{props.order.paymentStatus}</span>
            </p>
            <p className="text-sm">
              Transaction Date :{' '}
              <span className="font-semibold">
                {formattedDate(props.order.createdAt)}
              </span>
            </p>
            {props.order.paymentStatus === 'SHIPPED' && (
              <p className="text-sm">
                Shipped Date :{' '}
                <span className="font-semibold">
                  {formattedDate(props.order.shippedAt)}
                </span>
              </p>
            )}
            {props.order.paymentProof != null && (
              <a
                className="mt-4 text-blue-700 underline rounded-md cursor-pointer hover:font-bold"
                onClick={() => openPaymentProof(props.order.paymentProof)}
              >
                Payment Proof
              </a>
            )}
          </div>

          <div>
            <p className="text-sm">
              Payment Method :{' '}
              <span className="font-semibold">{props.order.paymentMethod}</span>
            </p>
            <p className="text-sm">
              Shipping Cost :{' '}
              <span className="font-semibold">
                {formattedMoney(props.order.shippingCost)}
              </span>
            </p>
            <hr className="mt-2" />
            <p className="text-md">
              Total Price :{' '}
              <span className="text-lg font-semibold">
                {formattedMoney(props.order.total)}
              </span>
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            className="p-2 border border-secondary rounded-md cursor-pointer hover:font-bold"
            onClick={() => props.onClose(false)}
          >
            Close
          </button>
        </div>
      </div>
    )
  );
};
