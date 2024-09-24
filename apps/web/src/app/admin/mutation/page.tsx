'use client';

import ConfirmModal from '@/components/ConfirmModal';
import { useCallback, useEffect, useState } from 'react';
import { FaPen, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import { formattedMoney, getCookies } from '@/helper/helper';
import Link from 'next/link';
import { getMutations } from '@/api/inventory';
import ActionOrder from '@/components/ActionOrder';
import { mutation } from '@/interface/mutation.interface';

export default function MutationTable() {
  const cookies = getCookies();
  const { role } = JSON.parse(cookies.user);
  const [mutations, setMutations] = useState<mutation[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(page);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [id, setId] = useState<number>(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMutations(search, page);
      setMutations(res.data);
      setTotalPages(res.pagination.totalPages);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, [search, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      <div className="text-2xl mb-4">Table Inventory</div>
      <div className="grid gap-4">
        <div className="flex justify-between items-center gap-4">
          <div className="flex">
            <input
              type="text"
              placeholder="Search product"
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

          <Link
            href={'/admin/mutation/add'}
            className="bg-green-500 hover:bg-green-600 text-primary p-2 rounded"
          >
            <span className="flex items-center">
              <FaPlus /> &nbsp; Add Stock Mutation
            </span>
          </Link>
        </div>
        <table className="table-auto">
          <thead className="bg-secondary">
            <tr>
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Branch Destination</th>
              <th className="px-4 py-2">Branch Source</th>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Stock Request</th>
              <th className="px-4 py-2 w-2">Stock Process</th>
              <th className="px-4 py-2 w-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-2 font-bold">Loading...</td>
              </tr>
            ) : mutations.length == 0 ? (
              <tr>
                <td className="p-2 font-bold">Data not found!</td>
              </tr>
            ) : (
              mutations.map((mutation) => {
                return (
                  <tr key={mutation.id} className="border p-2">
                    <td className="border p-2 text-center">{mutation.no}</td>
                    <td className="border p-2 capitalize text-center">
                      <span
                        className={`bg-${mutation.status === 'PENDING' ? 'yellow' : mutation.status === 'APPROVED' ? 'green' : 'red'}-500 text-white p-1 rounded`}
                      >
                        {mutation.status}
                      </span>
                    </td>
                    <td className="border p-2">
                      {mutation.destinationBranch.name}
                    </td>
                    <td className="border p-2">{mutation.sourceBranch.name}</td>
                    <td className="border p-2">{mutation.product.name}</td>
                    <td className="border p-2">
                      {mutation.stockRequest ? mutation.stockRequest : 0} pcs
                    </td>
                    <td className="border p-2">
                      {mutation.stockProcess ? mutation.stockProcess : 0} pcs
                    </td>
                    <td className="p-2 justify-center">
                      <ActionOrder mutation={mutation} />
                    </td>
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
          title="Delete product"
          // for="order"
        />
      )}
    </div>
  );
}
