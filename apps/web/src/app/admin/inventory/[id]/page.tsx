/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { getUserAdmin } from '@/api/user';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useRouter } from 'next/navigation';
import { ShowMessage } from '@/components/ShowMessage';
import {
  createInventory,
  getBranchByUserId,
  getInventoryById,
  updateInventory,
} from '@/api/inventory';
import { getCookies } from '@/helper/helper';
import { getProducts } from '@/api/products';

const FormStore = () => {
  const cookies = getCookies();
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(branchSchemma),
  });

  const router = useRouter();
  const { id } = useParams();
  const storeId = Array.isArray(id) ? id[0] : id || null;
  const [dataMessage, setDataMessage] = useState({
    message: '',
    status: '',
    data: {},
  });
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [branch, setBranch] = useState('');
  const [product, setProduct] = useState([]);

  useEffect(() => {
    if (storeId != 'add') {
      getInventoryById(Number(storeId)).then((res) => {
        reset(res.data);
      });
    } else {
      setLoading(false);
    }
  }, [storeId, reset]);

  useEffect(() => {
    const fetchBranch = async () => {
      getBranchByUserId(Number(cookies.userId)).then((res) => {
        setBranch(res.data.name);
      });
    };
    const fetchProduct = async () => {
      getProducts(Number(20)).then((res) => {
        setProduct(res.data);
      });
    };

    fetchBranch();
    fetchProduct();
  }, []);

  const onSubmit = async (data: any) => {
    console.log(data, 'data submit');
    try {
      data = {
        ...data,
        branchId: cookies.userId,
        transactionType: 'IN',
      };

      let response;
      if (storeId == 'add') {
        response = await createInventory(data);
      } else {
        response = await updateInventory(storeId || '', data);
      }
      console.log(response, 'response');
      setDataMessage(response);
      setShowMessage(true);
      setTimeout(() => {
        router.push('/admin/inventory');
        setShowMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  return (
    <form>
      <div className="container mx-auto px-4">
        {showMessage == true ? (
          <ShowMessage
            name={
              dataMessage.message === 'Success adding stock'
                ? 'Add Data Success'
                : dataMessage.message === 'Success updating stock'
                  ? 'Edit Data Success'
                  : 'Failed'
            }
            desc={dataMessage.message}
            status={dataMessage.status}
            show={showMessage}
          />
        ) : null}
        <div className="text-2xl mb-4">Add Stock</div>
        <div className="grid grid-cols-2 gap-4 items-center">
          <label className="label">Branch</label>
          <input className="w-full border p-2" value={branch} disabled />

          {errors.name && (
            <p className="text-sm text-red-500">This field is required</p>
          )}

          <label className="label">Product</label>
          <select
            className="select select-bordered"
            {...register('productId', { required: true })}
            defaultValue=""
          >
            <option value="" disabled>
              Pick one
            </option>
            {product.map((item: { id: string; name: number }) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.name && (
            <p className="text-sm text-red-500">This field is required</p>
          )}

          <label className="label">Stock</label>
          <div className="">
            <input
              className="w-full border p-2"
              {...register('stock')}
              placeholder="Stock"
              type="number"
            />
            {errors.stock && (
              <p className="text-sm text-red-500">This field is required</p>
            )}
          </div>
        </div>
        <div className="my-4">
          <button
            className="bg-green-500 px-4 py-2 cursor-pointer text-white rounded"
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            Save{' '}
          </button>
        </div>
      </div>
    </form>
  );
};

export default FormStore;
