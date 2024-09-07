'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import profileSchema from '@/schemas/profile.schema';
import { updateProfile } from '@/api/profile';
import { getCookies } from '@/helper/helper';
import Cookies from 'js-cookie';

export default function ProfilePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(profileSchema),
  });

  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    image: '/profile.jpg',
  });

  const [preview, setPreview] = useState<string | null>('');
  const [file, setFile] = useState<File | null>(null);
  console.log(file, 'fileeee');

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
    if (!file) {
      alert('Please upload payment proof');
      return;
    }

    const formData = new FormData();
    formData.append('image', file); // Append the actual file, not file.name
    formData.append('username', data.username); // Append other form data

    console.log(formData, 'FORMDATA');
    const cookies = getCookies();
    console.log(data, 'data profile');

    try {
      const response = await updateProfile(Number(cookies.userId), formData); // Send formData directly
      Cookies.remove('user');
      setProfileData(response.data); // Update state with new profile data
      window.location.reload();
      Cookies.set('user', JSON.stringify(response.data), {
        expires: 1,
        secure: true,
      });
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h3 className="text-3xl font-bold mb-6 text-center">Profile</h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card shadow-lg p-6 bg-base-100"
      >
        {/* Username Field */}
        <div className="form-control mb-4">
          <label className="label font-semibold">Username</label>
          <input
            {...register('username')}
            defaultValue={profileData.username}
            className="input input-bordered w-full"
          />
          {errors.username && (
            <p className="text-error text-sm">{errors.username.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="form-control mb-4">
          <label className="label font-semibold">Email</label>
          <input
            {...register('email')}
            defaultValue={profileData.email}
            className="input input-bordered w-full"
          />
          {errors.email && (
            <p className="text-error text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="form-control mb-4">
          <label className="label font-semibold">Password (optional)</label>
          <input
            type="password"
            {...register('password')}
            className="input input-bordered w-full"
            placeholder="Leave blank to keep current password"
          />
          {errors.password && (
            <p className="text-error text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Profile Picture Field */}
        <div className="form-control mb-4">
          <label className="label font-semibold">Profile Picture</label>
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {preview && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div className="flex justify-center">
              <img
                src={preview}
                alt="Image Preview"
                className="w-48 h-auto max-h-96 rounded-lg border"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-full">
          Update Profile
        </button>
      </form>
    </div>
  );
}
