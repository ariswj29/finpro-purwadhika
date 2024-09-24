'use client';

import { getOrderComplete } from '@/api/order';
import { DetailOrder } from '@/components/DetailOrder';
import StatusOrder from '@/components/StatusOrder';
import { formattedDate, formattedMoney, getCookies } from '@/helper/helper';
import { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa';

export default function OrderCompletePage() {
  const cookies = getCookies();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getOrderComplete(Number(cookies.userId));
        setData(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [cookies.userId]);

  const handleOpenDetail = (order: any) => {
    setSelectedOrder(order);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedOrder(null);
  };

  return (
    <div className="relative p-4 sm:p-8 lg:p-12 border-2 shadow-md w-full">
      <h3 className="text-lg sm:text-xl lg:text-2xl font-bol pb-4">
        Order List Complete
      </h3>

      {/* Modal Detail */}
      {openDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black opacity-70"></div>
          <div className="relative bg-white p-4 rounded-lg shadow-lg z-10 w-full max-w-md sm:max-w-lg">
            <DetailOrder
              show={openDetail}
              order={selectedOrder}
              onClose={handleCloseDetail}
            />
          </div>
        </div>
      )}

      {/* Tabel Order */}
      <div
        className={`${openDetail ? 'opacity-50 pointer-events-none' : ''} overflow-x-auto`}
      >
        <table className="table-auto w-full text-sm sm:text-base">
          <thead>
            <tr>
              <th className="px-2 py-3">No</th>
              <th className="px-2 py-3">No Order</th>
              <th className="px-2 py-3">Date Order</th>
              <th className="px-2 py-3">Status</th>
              <th className="px-2 py-3">Total Price</th>
              <th className="px-2 py-3">Action</th>
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
                  Data order complete is empty
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={index} className="border-b">
                  <th className="px-2 py-2">{index + 1}</th>
                  <td className="px-2 py-2">{item.name}</td>
                  <td className="px-2 py-2">{formattedDate(item.createdAt)}</td>
                  <td className="px-2 py-2">
                    <StatusOrder status="COMPLETE" />
                  </td>
                  <td className="px-2 py-2">{formattedMoney(item.total)}</td>
                  <td className="px-2 py-2">
                    <div className="dropdown dropdown-left dropdown-end">
                      <div tabIndex={0} role="button" className="m-1">
                        <FaBars />
                      </div>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-32 p-2 shadow"
                      >
                        <li className="my-1">
                          <a
                            className="font-semibold bg-slate-300"
                            onClick={() => handleOpenDetail(item)}
                          >
                            Detail
                          </a>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
