'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getProfile, updateProfile, verifyEmail } from '@/api/profile'; // Pastikan Anda memiliki fungsi ini untuk mengambil data profil
import { getCookies } from '@/helper/helper';
import Cookies from 'js-cookie';
import Image from 'next/image';

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    image: '/profile.jpg',
  });

  const [preview, setPreview] = useState<string | null>('');
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(profileSchema),
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      const cookies = getCookies();
      try {
        const profileResponse = await getProfile(Number(cookies.userId));
        setProfileData(profileResponse.data);
        setValue('username', profileResponse.data.username);
        setValue('email', profileResponse.data.email);
        setPreview(
          `http://localhost:8000/uploads/profile/${profileResponse.data.image}`,
        );
      } catch (error) {
        console.error('Gagal mengambil data profil:', error);
      }
    };

    fetchProfileData();
  }, [setValue]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFile(file);
    }
  };

  const onSubmit = async (data: any) => {
    const cookies = getCookies();

    const formData = new FormData();
    if (file) {
      formData.append('image', file);
    }
    formData.append('username', data.username || '');
    if (data.password) {
      formData.append('password', data.password);
    }
    formData.append('confirmPassword', data.confirmPassword || '');

    try {
      const response = await updateProfile(Number(cookies.userId), formData);
      Cookies.set('user', JSON.stringify(response.data), {
        expires: 1,
        secure: true,
      });
      setProfileData(response.data);
      window.location.reload();
    } catch (error) {
      console.error('Perbaruan profil gagal:', error);
    }
  };

  const onSubmitEmail = async (data: any) => {
    const cookies = getCookies();

    console.log(data, 'formdata email');

    try {
      const response = await verifyEmail(Number(cookies.userId), data);
      Cookies.set('user', JSON.stringify(response.data), {
        expires: 1,
        secure: true,
      });
      setProfileData(response.data);
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Perbaruan profil gagal:', error);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h3 className="text-3xl font-bold mb-6 text-center">My Profile</h3>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card shadow-lg p-6 bg-base-100 mb-6"
      >
        {preview && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2"></label>
            <div className="flex justify-center">
              <img
                src={preview}
                alt="Pratampilan Gambarss"
                className="w-48 h-auto max-h-96 rounded-lg border"
              />
            </div>
          </div>
        )}
        <div className="form-control mb-4">
          <label className="label font-semibold">Profile Picture</label>
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="form-control mb-4">
          <label className="label font-semibold">Username</label>
          <input
            {...register('username')}
            className="input input-bordered w-full"
          />
          {errors.username && (
            <p className="text-error text-sm">{errors.username.message}</p>
          )}
        </div>

        <button type="submit" className="btn w-full">
          update profile
        </button>
      </form>

      <form
        onSubmit={handleSubmit(onSubmitEmail)}
        className="card shadow-lg p-6 bg-base-100 mb-6"
      >
        <div className="form-control mb-4">
          <label className="label font-semibold">Email</label>
          <input
            {...register('email')}
            className="input input-bordered w-full"
          />
          {errors.email && (
            <p className="text-error text-sm">{errors.email.message}</p>
          )}
        </div>

        <button type="submit" className="btn w-full">
          Update Email
        </button>
      </form>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card shadow-lg p-6 bg-base-100"
      >
        <div className="form-control mb-4">
          <label className="label font-semibold">Password</label>
          <input
            type="password"
            {...register('password')}
            className="input input-bordered w-full"
            placeholder="Masukkan password baru"
          />
          {errors.password && (
            <p className="text-error text-sm">{errors.password.message}</p>
          )}
        </div>

        <div className="form-control mb-4">
          <label className="label font-semibold">Confirm Password</label>
          <input
            type="password"
            {...register('confirmPassword')}
            className="input input-bordered w-full"
            placeholder="Konfirmasi password baru"
          />
          {errors.confirmPassword && (
            <p className="text-error text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button type="submit" className="btn w-full">
          Save Password
        </button>
      </form>
    </div>
  );
}
