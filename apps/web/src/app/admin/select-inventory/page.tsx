'use client';

import { getAllBranches } from '@/api/branch';
import ConfirmModal from '@/components/ConfirmModal';
import { Branch } from '@/interface/branches.interface';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { FaEye, FaPen, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';

export default function SelectInventoryPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(page);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [id, setId] = useState<number>(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllBranches(search, page);
      setBranches(res.data);
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
      <div className="text-2xl mb-4">Select Store</div>
      <div className="grid gap-4">
        <div className="flex justify-between items-center gap-4">
          <div className="flex">
            <input
              type="text"
              placeholder="Search"
              className="border p-2"
              value={search}
              onChange={handleSearchChange}
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white  py-2 px-4 rounded"
              onClick={handleSearchClick}
            >
              <FaSearch />
            </button>
          </div>
          <Link
            href={'/admin/stores/add'}
            className="bg-green-500 hover:bg-green-600 text-primary p-2 rounded"
          >
            <span className="flex items-center">
              <FaPlus /> &nbsp; Add Store
            </span>
          </Link>
        </div>

        {/* Card-based layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div>Loading...</div>
          ) : branches.length === 0 ? (
            <div>Data not found!</div>
          ) : (
            branches.map((branch: Branch, index) => (
              <Link href={`/admin/select-inventory/${branch.id}`} key={index}>
                <div className="bg-white hover:border-2 shadow-md rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full mr-4">
                      <Image
                        src="/favicon.png"
                        alt="avatar"
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-lg">{branch.name}</div>
                      <div className="text-sm text-gray-500">
                        {branch.user.username}
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm">
                      <strong>Address: </strong> {branch.address}
                    </p>
                    <p className="text-sm">
                      <strong>Province: </strong> {branch.province.name}
                    </p>
                    <p className="text-sm">
                      <strong>City: </strong> {branch.city.name}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center space-x-4">
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

      {confirmationModal === true ? (
        <ConfirmModal
          id={id}
          setModal={setConfirmationModal}
          title="Delete branch"
        />
      ) : null}
    </div>
  );
}
