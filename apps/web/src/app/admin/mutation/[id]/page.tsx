/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { getUserAdmin } from '@/api/user';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useRouter } from 'next/navigation';
import { ShowMessage } from '@/components/ShowMessage';
import {
  createMutation,
  getBranchByUserId,
  getMutationById,
  updateMutation,
} from '@/api/inventory';
import { getCookies } from '@/helper/helper';
import { getProducts } from '@/api/products';
import { mutationSchema } from '@/schemas/mutation.schmea';

const FormStore = () => {
  const cookies = getCookies();
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(mutationSchema),
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
  const [adminBranch, setAdminBranch] = useState([]);
  const [product, setProduct] = useState([]);
  const [branch, setBranch] = useState('');
  const [data, setData] = useState({
    stockRequest: '',
    stockProcess: '',
    productId: '',
    sourceBranchId: '',
    destinationBranchId: '',
    note: '',
    sourceBranch: {
      name: '',
    },
  });

  useEffect(() => {
    if (storeId != 'add') {
      getMutationById(Number(storeId)).then((res) => {
        reset(res.data);
        setBranch(res.data.destinationBranch.name);
        console.log(res.data, 'res data');
        setData(res.data);
      });
    } else {
      setLoading(false);
    }
  }, [storeId, reset]);

  useEffect(() => {
    if (storeId == 'add') {
      const fetchBranch = async () => {
        getBranchByUserId(Number(cookies.userId)).then((res) => {
          setBranch(res.data.name);
        });
      };
      fetchBranch();
    }

    const fetchAdminBranch = async () => {
      getUserAdmin().then((res) => {
        setAdminBranch(res.data);
      });
    };

    const fetchProduct = async () => {
      getProducts(Number(100)).then((res) => {
        setProduct(res.data);
      });
    };

    fetchAdminBranch();
    fetchProduct();
  }, []);

  const onSubmit = async (data: any) => {
    console.log(data, 'data submit');
    const cookies = getCookies();
    try {
      let response;
      if (storeId == 'add') {
        data = {
          ...data,
          destinationBranchId: cookies.userId,
        };
        response = await createMutation(data);
      } else {
        response = await updateMutation(storeId || '', data);
      }
      console.log(response, 'response');
      setDataMessage(response);
      setShowMessage(true);
      setTimeout(() => {
        router.push('/admin/mutation');
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
              dataMessage.message === 'Success request mutation'
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
        <div className="text-2xl mb-4">Add Stock by Mutation</div>
        <div className="grid grid-cols-2 gap-4 items-center">
          <label className="label">Branch Destination</label>
          <input className="w-full border p-2" value={branch} disabled />

          <label className="label">Branch Source</label>
          {storeId == 'add' ? (
            <select
              className="select select-bordered"
              {...register('sourceBranchId')}
            >
              <option value="" disabled>
                Pick one
              </option>
              {adminBranch.map(
                (item: { id: string; branch: { name: string } }) => (
                  <option key={item.id} value={item.id}>
                    {item?.branch?.name}
                  </option>
                ),
              )}
            </select>
          ) : (
            <input
              className="w-full border p-2"
              {...register('sourceBranchId')}
              value={data.sourceBranch.name}
              disabled
            />
          )}

          <label className="label">Product</label>
          <select
            className="select select-bordered"
            {...register('productId')}
            defaultValue=""
            disabled={storeId != 'add'}
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

          <label className="label">Stock Request</label>
          <div className="">
            <input
              className="w-full border p-2"
              {...register('stockRequest')}
              placeholder="Stock"
              type="number"
              disabled={storeId != 'add'}
            />
            {errors.stockRequest && (
              <p className="text-sm text-red-500">This field is required</p>
            )}
          </div>

          <label className="label">Stock Process</label>
          <div className="">
            <input
              className="w-full border p-2"
              {...register('stockProcess')}
              placeholder="Stock"
              type="number"
              disabled={storeId == 'add'}
            />
            {errors.stockProcess && (
              <p className="text-sm text-red-500">
                {typeof errors.stockProcess.message === 'string' &&
                  errors.stockProcess.message}
              </p>
            )}
          </div>

          <label className="label">Note</label>
          <div className="">
            <input
              className="w-full border p-2"
              {...register('note')}
              placeholder="Note"
              disabled={storeId != 'add'}
            />
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
