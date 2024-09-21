/* eslint-disable react-hooks/exhaustive-deps */
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
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Ikon custom untuk marker
const icon = new L.Icon({
  iconUrl: '/map-marker.png',
  iconSize: [35, 35],
  iconAnchor: [12, 12],
});

export default function AddAddress() {
  const cookies = getCookies();
  const router = useRouter();
  const { id } = useParams();
  const addressId = Array.isArray(id) ? id[0] : id || null;
  const [province, setProvince] = useState([]);
  const [city, setCity] = useState([]);
  const [latitude, setLatitude] = useState(-6.2088); // Default Jakarta
  const [longitude, setLongitude] = useState(106.8456); // Default Jakarta
  const [loading, setLoading] = useState(true);
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
          setLatitude(data.data.latitude);
          setLongitude(data.data.longitude);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching address:', error);
        });
    } else {
      setLoading(false);
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

    const provinceId = watch('provinceId');

    fetchProvince();
    if (provinceId) {
      fetchCity(provinceId);
    } else {
      setCity([]);
    }
  }, [watch, watch('provinceId')]);

  const onSubmit = async (data: any, event: any) => {
    try {
      data = {
        ...data,
        userId: Number(cookies.userId),
        longitude,
        latitude,
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

  function LocationMarker() {
    const map = useMapEvents({
      click(e: any) {
        setLatitude(e.latlng.lat);
        setLongitude(e.latlng.lng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return latitude && longitude ? (
      <Marker position={[latitude, longitude]} icon={icon}></Marker>
    ) : null;
  }

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
        <div className="md:grid py-4">
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

          {/* Map with Leaflet */}
          <div className="label">
            <span className="label-text font-bold">Map</span>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <p className="font-bold">Loading...</p>
            </div>
          ) : (
            <div className="my-2 h-96">
              <MapContainer
                className="sticky"
                center={[latitude, longitude]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker />
              </MapContainer>
            </div>
          )}

          {/* Latitude and Longitude */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-bold">Latitude</span>
            </div>
            <input
              type="text"
              value={latitude}
              className="input input-bordered"
              readOnly
            />
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-bold">Longitude</span>
            </div>
            <input
              type="text"
              value={longitude}
              className="input input-bordered"
              readOnly
            />
          </label>

          {/* Submit button */}
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
