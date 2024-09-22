'use client';

import { getJournals } from '@/api/inventory';
import ConfirmModal from '@/components/ConfirmModal';
import { formattedDateAndHour } from '@/helper/helper';
import { useCallback, useEffect, useState } from 'react';

interface Journal {
  no: number;
  id: number;
  createdAt: string;
  transactionType: string;
  quantity: number;
  email: string;
  description: string;
  productBranch: {
    product: {
      name: string;
    };
  };
}
import { FaSearch } from 'react-icons/fa';

export default function JournalPage() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(page);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [id, setId] = useState<number>(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getJournals(page);
      setJournals(res.data);
      setTotalPages(res.pagination.totalPages);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, [page]);

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
      <div className="text-2xl mb-4">Table History Journal</div>
      <div className="grid gap-4">
        <table className="table-auto">
          <thead className="bg-secondary">
            <tr>
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Transaction</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-2 font-bold">Loading...</td>
              </tr>
            ) : journals.length == 0 ? (
              <tr>
                <td className="p-2 font-bold">Data not found!</td>
              </tr>
            ) : (
              journals.map((journal, index) => (
                <tr key={journal.id} className="border p-2">
                  <td className="border p-2">{journal.no}</td>
                  <td className="border p-2">
                    {formattedDateAndHour(journal.createdAt)}
                  </td>
                  <td className="border p-2 text-center">
                    {journal.transactionType}
                  </td>
                  <td className="border p-2 text-center">{journal.quantity}</td>
                  <td className="border p-2">
                    {journal.productBranch.product.name}
                  </td>
                  <td className="border p-2">{journal.description}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
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
        {confirmationModal === true ? (
          <ConfirmModal
            id={id}
            setModal={setConfirmationModal}
            title="Delete user"
          />
        ) : null}
      </div>
    </div>
  );
}
