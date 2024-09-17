'use client';

import { createUserProcess, getUserById, updateUserProcess } from '@/api/user';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useRouter } from 'next/navigation';
import { ShowMessage } from '@/components/ShowMessage';
import { usersSchema } from '@/schemas/users.schema';
import { updateBranch } from '@/api/branch';
import { getCity, getProvince } from '@/api/address';

const FormUsers = () => {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(usersSchema),
  });

  const router = useRouter();
  const { id } = useParams();
  const [province, setProvince] = useState([]);
  const [city, setCity] = useState([]);
  const branchId = Array.isArray(id) ? id[0] : id || null;
  const [notif, setNotif] = useState<{ message: string; status: string }>({
    message: '',
    status: '',
  });
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (branchId != 'add') {
      getUserById(branchId || '')
        .then((data) => {
          reset(data.data);
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
        });
    }
  }, [branchId, reset]);

  useEffect(() => {
    if (branchId) {
      reset({ ...watch() });
    }
  }, [branchId, reset, watch]);

  useEffect(() => {
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

    fetchProvince();
    const provinceId = watch('provinceId');
    if (provinceId) {
      fetchCity(provinceId);
    } else {
      setCity([]);
    }
  }, [watch('provinceId')]);

  const formSubmit = async (formData: any) => {
    try {
      if (branchId != 'add') {
        const response = await updateBranch(branchId || '', formData);
        setShowMessage(true);
        setDataMessage(response);
      } else {
        const response = await createUserProcess(formData);
        setShowMessage(true);
        setDataMessage(response);
      }
      setTimeout(() => {
        setShowMessage(false);
        router.push('/admin/stores');
      }, 3000);
    } catch (error) {
      console.error('Error creating/updating branch:', error);
    }
  };

  return (
    <div className="shadow container mx-auto px-4">
      <form>
        {toastVisible && (
          <div
            className="toast toast-top toast-end"
            style={{
              position: 'fixed',
              top: '3rem',
              right: '1rem',
              zIndex: 1000,
            }}
          >
            <div
              className={`alert ${toastMessage.status === 'success' ? 'alert-success' : 'alert-error'}`}
            >
              <span className="text-primary text-bold">
                {toastMessage.message}
              </span>
            </div>
          </div>
        )}
        <div className="md:grid">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-bold">Name</span>
            </div>
            <input
              type="text"
              placeholder="Name"
              className="input input-bordered"
              {...register('name', { required: true })}
            />
            {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
            )}
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-bold">Province</span>
            </div>
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
              <span className="text-red-500">{errors.provinceId.message}</span>
            )}
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-bold">City</span>
            </div>
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
              <span className="text-red-500">{errors.cityId.message}</span>
            )}
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-bold">Address</span>
            </div>
            <input
              type="text"
              placeholder="Address"
              className="input input-bordered"
              {...register('address', { required: true })}
            />
            {errors.address && (
              <span className="text-red-500">{errors.address.message}</span>
            )}
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-bold">Postal Code</span>
            </div>
            <input
              type="text"
              placeholder="Postal Code"
              className="input input-bordered"
              {...register('postalCode', { required: true })}
            />
            {errors.postalCode && (
              <span className="text-red-500">{errors.postalCode.message}</span>
            )}
          </label>
          <button
            type="submit"
            className="btn bg-secondary my-4"
            onClick={handleSubmit(onSubmit)}
          >
            <FaPlus /> Submit
          </button>
        </div>
      </form>
    </div>
  );
};
