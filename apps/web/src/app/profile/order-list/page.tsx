'use client';

import { getAllOrder } from '@/api/order';
import ConfirmModal from '@/components/ConfirmModal';
import { DetailOrder } from '@/components/DetailOrder';
import StatusOrder from '@/components/StatusOrder';
import UploadPaymentPage from '@/components/UploadPayment';
import { formattedDate, formattedMoney, getCookies } from '@/helper/helper';
import { useCallback, useEffect, useState } from 'react';
import { FaBars, FaSearch } from 'react-icons/fa';

export default function OrderListPage() {
  const cookies = getCookies();
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [openPayment, setOpenPayment] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [id, setId] = useState<number>(0);
  const [forModal, setFor] = useState<string>('');

  const fetchData = useCallback(async () => {
    try {
      const res = await getAllOrder(Number(cookies.userId), search);
      setData(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, [cookies.userId, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearchClick = () => {
    fetchData();
  };

  const handleOpenDetail = (order: any) => {
    setSelectedOrder(order);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedOrder(null);
  };

  const handleOpenPayment = (order: any) => {
    setSelectedOrder(order);
    setOpenPayment(true);
  };

  const handleClosePayment = () => {
    setOpenPayment(false);
    setSelectedOrder(null);
  };

  return (
    <div className="relative p-12 sm:p-16 border-2 shadow-md w-full">
      <div className="flex flex-col md:flex-row justify-between items-center pb-4">
        <h3 className="text-2xl font-bold">Order List</h3>
        <div className="flex px-4">
          <input
            type="text"
            placeholder="Search order"
            className="border p-2"
            value={search}
            onChange={handleSearchChange}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            onClick={handleSearchClick}
          >
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Modal Detail */}
      {openDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-70"></div>
          <div className="relative bg-white p-2 rounded-lg shadow-lg z-10 max-w-md w-full sm:w-auto">
            <DetailOrder
              show={openDetail}
              order={selectedOrder}
              onClose={handleCloseDetail}
            />
          </div>
        </div>
      )}

      {/* Modal Payment */}
      {openPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-70"></div>
          <div className="relative bg-white p-2 rounded-lg shadow-lg z-10 max-w-md w-full sm:w-auto">
            <UploadPaymentPage
              order={selectedOrder}
              onClose={handleClosePayment}
            />
          </div>
        </div>
      )}

      {/* Table Order */}
      <div
        className={`overflow-x-auto w-full ${openDetail || openPayment ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <table className="table w-full h-40">
          <thead>
            <tr>
              <th>No</th>
              <th>No Order</th>
              <th>Date Order</th>
              <th>Status</th>
              <th>Total Price</th>
              <th>Action</th>
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
                  Data list order is empty
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{item.name}</td>
                  <td>{formattedDate(item.createdAt)}</td>
                  <td>
                    <StatusOrder status={item.paymentStatus} />
                  </td>
                  <td>{formattedMoney(item.total)}</td>
                  <td>
                    <div className="dropdown dropdown-left">
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
                        {item.paymentStatus == 'UNPAID' && (
                          <>
                            <li className="my-1">
                              <a
                                className="font-semibold bg-blue-400"
                                onClick={() => handleOpenPayment(item)}
                              >
                                Upload Payment
                              </a>
                            </li>
                            <li className="my-1">
                              <a
                                className="font-semibold bg-red-400"
                                onClick={() => {
                                  setConfirmationModal(true);
                                  setId(item.id);
                                  setFor('cancel order');
                                }}
                              >
                                Cancel Order
                              </a>
                            </li>
                          </>
                        )}
                        {item.paymentStatus == 'SHIPPED' && (
                          <li className="my-1">
                            <a
                              className="font-semibold bg-green-400"
                              onClick={() => {
                                setConfirmationModal(true);
                                setId(item.id);
                                setFor('received order');
                              }}
                            >
                              Received Order
                            </a>
                          </li>
                        )}
                      </ul>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {confirmationModal && (
        <ConfirmModal
          id={id}
          setModal={setConfirmationModal}
          title={forModal}
        />
      )}
    </div>
  );
}
