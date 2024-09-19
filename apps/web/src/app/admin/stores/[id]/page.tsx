'use client';

import { getUserAdmin } from '@/api/user';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useRouter } from 'next/navigation';
import { ShowMessage } from '@/components/ShowMessage';
import { branchSchemma } from '@/schemas/branch.schema';
import { createBranch, getBranch, updateBranch } from '@/api/branch';
import { getCity, getProvince } from '@/api/address';

const FormStore = () => {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(branchSchemma),
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
  const [province, setProvince] = useState([]);
  const [city, setCity] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    if (storeId != 'add') {
      getBranch(Number(storeId) || 0)
        .then((data) => {
          reset(data.data);
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
        });
    }
  }, [storeId, reset]);

  useEffect(() => {
    if (storeId) {
      reset({ ...watch() });
    }
  }, [storeId, reset, watch]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserAdmin();
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchProvince = async () => {
      try {
        const res = await getProvince();
        setProvince(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchCity = async (provinceId: string) => {
      try {
        const res = await getCity(provinceId);
        setCity(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
    fetchProvince();
    const provinceId = watch('provinceId');
    if (provinceId) {
      fetchCity(provinceId);
    } else {
      setCity([]);
    }
  }, [watch('provinceId')]);

  const onSubmit = async (data: any) => {
    console.log(data, 'data submit');
    try {
      data = {
        ...data,
        longitude: 0,
        latitude: 0,
      };
      let response;
      if (storeId == 'add') {
        response = await createBranch(data);
      } else {
        response = await updateBranch(storeId || '', data);
      }
      console.log(response, 'response');
      setDataMessage(response);
      setShowMessage(true);
      setTimeout(() => {
        router.push('/admin/stores');
        setShowMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  return (
    <form>
      <div className="container mx-auto px-4">
        {showMessage === true ? (
          <ShowMessage
            name={
              dataMessage.message === 'Branch successfully created'
                ? 'Add Data Success'
                : dataMessage.message === 'Branch successfully updated'
                  ? 'Edit Data Success'
                  : 'Failed'
            }
            desc={dataMessage.message}
            status={dataMessage.status}
            show={showMessage}
          />
        ) : null}
        <div className="text-2xl mb-4">Add Store</div>
        <div className="grid grid-cols-2 gap-4 items-center">
          <label className="label">Name Branch</label>
          <div className="">
            <input
              className="w-full border p-2"
              {...register('name')}
              placeholder="Name Branch"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <label className="label">Province</label>
          <select
            className="select select-bordered"
            {...register('provinceId', { required: true })}
            defaultValue=""
          >
            <option value="" disabled>
              Pick one
            </option>
            {province.map((prov: { id: string; name: number }) => (
              <option key={prov.id} value={prov.id}>
                {prov.name}
              </option>
            ))}
          </select>
          {errors.provinceId && (
            <span className="text-red-500">This field is required</span>
          )}
          <label className="label">City</label>
          <select
            className="select select-bordered"
            {...register('cityId', { required: true })}
            defaultValue=""
          >
            <option value="" disabled>
              Pick one
            </option>
            {city.map((c: { id: string; name: number }) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.cityId && (
            <span className="text-red-500">This field is required</span>
          )}

          <label className="label">Address</label>
          <div className="">
            <textarea
              className="w-full border p-2"
              {...register('address')}
              placeholder="Address"
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          <label className="label">Postal Code</label>
          <div className="">
            <input
              className="w-full border p-2"
              {...register('postalCode')}
              placeholder="Postal Code"
            />
            {errors.postalCode && (
              <p className="text-sm text-red-500">
                {errors.postalCode.message}
              </p>
            )}
          </div>

          <label className="label">Admin Store</label>
          <select
            className="select select-bordered"
            {...register('userId')}
            defaultValue=""
          >
            <option value="" disabled>
              Pick one
            </option>
            {user.map(
              (prov: { id: string; username: string; email: string }) => (
                <option key={prov.id} value={prov.id}>
                  {prov.username} | {prov.email}
                </option>
              ),
            )}
          </select>

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
      </div>
    </form>
  );
};

export default FormStore;
