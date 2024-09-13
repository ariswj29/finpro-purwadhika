'use client';

// import { getAllTableOrders } from '@/api/order';
import ConfirmModal from '@/components/ConfirmModal';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { formattedMoney, getCookies } from '@/helper/helper';
import { getAllOrders } from '@/api/order';
import { Order } from '@/interface/order.interface';
import ActionOrder from '@/components/ActionOrder';
import StatusOrder from '@/components/StatusOrder';

export default function OrderTable() {
  const cookies = getCookies();
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(page);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [id, setId] = useState<number>(0);

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    setLoading(true);
    const branchId = cookies.userId ? cookies.userId : 0;
    try {
      const res = await getAllOrders(search, branchId, page);
      setOrders(res.data);
      setTotalPages(res.pagination.totalPages);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearchClick = () => {
    fetchData();
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="text-2xl mb-4">Table Orders</div>
      <div className="grid gap-4">
        <div className="flex justify-between items-center gap-4">
          <div className="flex">
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
        <table className="table-auto">
          <thead className="bg-secondary">
            <tr>
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">No Order</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">
                {cookies.userId == 1 ? 'Branch' : 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-2 font-bold">Loading...</td>
              </tr>
            ) : orders.length == 0 ? (
              <tr>
                <td className="p-2 font-bold">Data not found!</td>
              </tr>
            ) : (
              orders.map((order: Order, index) => {
                return (
                  <tr key={order.id} className="border p-2">
                    <td className="border p-2 text-center">{order.no}</td>
                    <td className="border p-2 capitalize">{order.name}</td>
                    <td className="flex border p-2 capitalize justify-center">
                      {StatusOrder({ status: order.paymentStatus })}
                    </td>
                    <td className="border p-2">{order.user.username}</td>
                    <td className="border p-2 text-right">
                      {formattedMoney(order.total)}
                    </td>
                    {cookies.userId == 1 ? (
                      <td className="flex p-2 justify-center">
                        {order.branch.name}
                      </td>
                    ) : (
                      <td className="flex p-2 justify-center">
                        <ActionOrder order={order} />
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-center gap-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:bg-slate-500"
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          Prev
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ml-2 disabled:bg-slate-500"
          onClick={handleNextPage}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
      {confirmationModal && (
        <ConfirmModal
          id={id}
          setModal={setConfirmationModal}
          title="Delete"
          // for="order"
        />
      )}
    </div>
  );
}
