'use client';

import ConfirmModal from '@/components/ConfirmModal';
import { useCallback, useEffect, useState } from 'react';
import { FaPen, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import { formattedMoney, getCookies } from '@/helper/helper';
import { Product } from '@/interface/product.interface';
import { getProducts } from '@/api/products';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductTable() {
  const cookies = getCookies();
  const { role } = JSON.parse(cookies.user);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(page);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [id, setId] = useState<number>(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProducts(search, page);
      setProducts(res.data);
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
      <div className="text-2xl mb-4">Table Products</div>
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
          {role === 'SUPER_ADMIN' && (
            <Link
              href={'/admin/products/add'}
              className="bg-green-500 hover:bg-green-600 text-primary p-2 rounded"
            >
              <span className="flex items-center">
                <FaPlus /> &nbsp; Add Product
              </span>
            </Link>
          )}
        </div>
        <table className="table-auto">
          <thead className="bg-secondary">
            <tr>
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Price</th>
              {role === 'SUPER_ADMIN' && <th className="px-4 py-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-2 font-bold">Loading...</td>
              </tr>
            ) : products.length == 0 ? (
              <tr>
                <td className="p-2 font-bold">Data not found!</td>
              </tr>
            ) : (
              products.map((product: Product, index) => {
                return (
                  <tr key={product.id} className="border p-2">
                    <td className="border p-2 text-center">{product.no}</td>
                    <td className="flex border p-2 capitalize justify-center">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/products/${product.image}`}
                        width={50}
                        height={50}
                        alt={product.name}
                      />
                    </td>
                    <td className="border p-2 capitalize">{product.name}</td>
                    <td className="border p-2">{product.category.name}</td>
                    <td className="border p-2">{product.totalStock} pcs</td>
                    <td className="border p-2 text-right">
                      {formattedMoney(product.price)}
                    </td>
                    {role === 'SUPER_ADMIN' && (
                      <td className="border p-2">
                        <Link href={`/admin/products/${product.id}`}>
                          <button className="bg-yellow-500 hover:bg-yellow-600 text-primary p-1 rounded">
                            <FaPen />
                          </button>
                        </Link>
                        <button
                          onClick={() => {
                            setConfirmationModal(true);
                            setId(product.id);
                          }}
                          className="bg-red-500 hover:bg-red-600 text-primary p-1 rounded ml-2"
                        >
                          <FaTrash />
                        </button>
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
          title="Delete product"
          // for="order"
        />
      )}
    </div>
  );
}
