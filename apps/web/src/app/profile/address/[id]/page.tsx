'use client';
import {
  addAddress,
  addressDetail,
  editAddress,
  getAddress,
  getCity,
  getProvince,
} from '@/api/address';
import NotificationToast from '@/components/NotificationToast';
import { getCookies } from '@/helper/helper';
import { addressSchema } from '@/schemas/address.schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa';

export default function AddAddress() {
  const cookies = getCookies();
  const router = useRouter();
  const { id } = useParams();
  const addressId = Array.isArray(id) ? id[0] : id || null;
  const [province, setProvince] = useState([]);
  const [city, setCity] = useState([]);
  const [notif, setNotif] = useState<{ message: string; status: string }>({
    message: '',
    status: '',
  });
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addressSchema),
  });

  useEffect(() => {
    if (addressId != 'add') {
      addressDetail(addressId || '')
        .then((data) => {
          reset(data.data);
        })
        .catch((error) => {
          console.error('Error fetching address:', error);
        });
    }
  }, [addressId, reset]);

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

  const onSubmit = async (data: any, event: any) => {
    try {
      data = {
        ...data,
        userId: Number(cookies.userId),
        longitude: 0,
        latitude: 0,
      };
      let response;
      if (addressId == 'add') {
        response = await addAddress(data);
      } else {
        response = await editAddress(addressId || '', data);
      }
      showToast(response);
      setTimeout(() => {
        router.push('/profile/address');
      }, 3000);
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const showToast = (data: { message: string; status: string }) => {
    setNotif(data);
    setTimeout(() => {
      setNotif({ message: '', status: '' });
    }, 3000);
  };

  return (
    <div className="shadow container mx-auto px-4">
      <form>
        <NotificationToast toastMessage={notif} />
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
              <span className="text-red-500">This field is required</span>
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
              <span className="text-red-500">This field is required</span>
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
              <span className="text-red-500">This field is required</span>
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
              <span className="text-red-500">This field is required</span>
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
              <span className="text-red-500">This field is required</span>
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
}
