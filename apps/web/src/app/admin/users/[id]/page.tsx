'use client';

import { createUserProcess, getUserById, updateUserProcess } from '@/api/user';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useRouter } from 'next/navigation';
import { ShowMessage } from '@/components/ShowMessage';
import { usersSchema } from '@/schemas/users.schema';
import Image from 'next/image';

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
  const userId = Array.isArray(id) ? id[0] : id || null;
  const [dataMessage, setDataMessage] = useState({
    message: '',
    status: '',
    data: {},
  });
  const [showMessage, setShowMessage] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>('');

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

  useEffect(() => {
    if (userId != 'add') {
      getUserById(userId || '')
        .then((data) => {
          reset(data.data);
          setPreview(
            `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/profile/` +
              data.data.image,
          );
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
        });
    }
  }, [userId, reset]);

  useEffect(() => {
    if (userId) {
      reset({ ...watch() });
    }
  }, [userId, reset, watch]);

  const formSubmit = async (formData: any) => {
    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      if (file) {
        formDataToSend.append('image', file);
      }

      let response;
      if (userId != 'add') {
        response = await updateUserProcess(userId || '', formDataToSend);
      } else {
        response = await createUserProcess(formDataToSend);
      }

      setShowMessage(true);
      setDataMessage(response);
      setTimeout(() => {
        setShowMessage(false);
        router.push('/admin/users');
      }, 3000);
    } catch (error) {
      console.error('Error creating/updating user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(formSubmit)}>
      <div className="container mx-auto px-4">
        {showMessage === true ? (
          <ShowMessage
            name={
              dataMessage.message === 'User successfully created'
                ? 'Add Data Success'
                : dataMessage.message === 'User successfully updated'
                  ? 'Edit Data Success'
                  : 'Failed'
            }
            desc={dataMessage.message}
            status={dataMessage.status}
            show={showMessage}
          />
        ) : null}
        <div className="text-2xl mb-4">Add User</div>
        <div className="grid grid-cols-2 gap-4 items-center">
          <label className="label">Username</label>
          <div className="">
            <input
              className="w-full border p-2"
              {...register('username')}
              placeholder="Username"
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          {userId !== '1' && (
            <>
              <label className="label">Role</label>
              <div className="">
                <select className="w-full border p-2" {...register('role')}>
                  <option value="" disabled selected>
                    Select Role
                  </option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="USER">USER</option>
                </select>
                {errors.role && (
                  <p className="text-sm text-red-500">{errors.role.message}</p>
                )}
              </div>
            </>
          )}

          <label className="label">Email</label>
          <div className="">
            <input
              className="w-full border p-2"
              {...register('email')}
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {userId == 'add' ? (
            <>
              <label className="label">Password</label>
              <div className="">
                <input
                  className="w-full border p-2"
                  type="password"
                  {...register('password')}
                  placeholder="Password"
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </>
          ) : null}

          <label className="label">Image</label>
          <div className="">
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              accept="image/*"
              onChange={handleFileChange}
            />
            {errors.image && (
              <p className="text-sm text-red-500">{errors.image.message}</p>
            )}
          </div>

          {preview && (
            <>
              <label className="label"></label>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <div className="flex justify-center">
                  <Image
                    src={preview}
                    alt="Image Preview"
                    width={192}
                    height={192}
                    className="w-48 h-auto max-h-96 rounded-lg border"
                  />
                </div>
              </div>
            </>
          )}

          <div className="formData my-4">
            <input
              className="bg-green-500 px-4 py-2 cursor-pointer text-white rounded"
              type="submit"
              value="Save"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default FormUsers;
