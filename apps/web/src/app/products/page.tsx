'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { formattedMoney } from '@/helper/helper';
import { getAllCategories, getAllListProducts } from '@/api/products';

import Category from '@/components/Category';
import { Categories } from '@/interface/category.interface';
import { Product } from '@/interface/product.interface';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [selectCategories, setSelectCategories] = useState('');
  const [searchEvents, setSearchEvents] = useState('');

  const fetchProductsPage = async (page = 1, limit = 16) => {
    setLoading(true);
    try {
      const response = await getAllListProducts(
        searchEvents,
        selectCategories,
        page,
        limit,
      );

      setProducts(response.data);
      setTotalPages(response.total);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProductsPage();
    async function fetchCategories() {
      try {
        const response = await getAllCategories();
        setCategories(response.data || []); // Ensure that `response.data` is an array or default to an empty array
      } catch (error) {
        console.error(error);
        setCategories([]); // In case of an error, set categories to an empty array
      }
    }
    fetchCategories();
  }, [selectCategories, searchEvents]);
  console.log(searchEvents, 'search');

  const handlePageChange = (newPage: number) => {
    console.log(newPage);

    setPage(newPage);
    fetchProductsPage(newPage);
  };

  const handleSortCategory = (sortConfig: string) => {
    setSelectCategories(sortConfig);
  };

  return (
    <div className="container mx-auto px-8 py-12">
      <h1 className="text-5xl font-bold mb-4 text-center">List Products</h1>
      <Category onSortChange={handleSortCategory} categories={categories} />
      <SearchBar setSearchEvents={setSearchEvents} className="" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 cursor-pointer">
        {loading ? (
          <span className="p-2 font-bold">Loading...</span>
        ) : products.length == 0 ? (
          <span className="p-2 font-bold">Data not found!</span>
        ) : (
          products.map((product) => {
            return (
              <div
                key={product.id}
                className="p-4 bg-white hover:bg-secondary shadow-lg rounded-lg border-2 border-secondary transform transition-transform duration-300 hover:scale-105 my-9"
              >
                <Image
                  src={`http://localhost:8000/products/${product.image}`}
                  alt={product.name}
                  className="bg-gray-200 rounded-lg h-48 w-full object-cover"
                  width={500}
                  height={500}
                />
                <h2 className="text-xl font-semibold pt-4">{product.name}</h2>
                <p className="text-gray-600">
                  {formattedMoney(product.price ?? 0)}
                </p>
                <div className="flex justify-center">
                  <Link href={`/${product.id}`}>
                    <button className="bg-secondary px-8 py-1 mt-4 rounded-2xl hover:font-bold">
                      Add to Cart
                    </button>
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
