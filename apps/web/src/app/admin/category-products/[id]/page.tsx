'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useRouter } from 'next/navigation';
import { ShowMessage } from '@/components/ShowMessage';
import { categorySchema } from '@/schemas/category.schema';
import {
  createCategory,
  getCategoryById,
  updateCategory,
} from '@/api/category';

const FormCategory = () => {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(categorySchema),
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

  useEffect(() => {
    if (userId != 'add') {
      getCategoryById(userId || '')
        .then((data) => {
          reset(data.data);
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
      let response = null;
      if (userId === 'add') {
        response = await createCategory(formData);
      } else {
        response = await updateCategory(userId || '', formData);
      }

      setShowMessage(true);
      setDataMessage(response);

      setTimeout(() => {
        setShowMessage(false);
        router.push('/admin/category-products');
      }, 3000);
    } catch (error) {
      console.error('Error creating/updating category:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(formSubmit)}>
      <div className="container mx-auto px-4">
        {showMessage === true ? (
          <ShowMessage
            name={
              dataMessage.message === 'Category successfully created'
                ? 'Add Data Success'
                : dataMessage.message === 'Category successfully updated'
                  ? 'Edit Data Success'
                  : 'Failed'
            }
            desc={dataMessage.message}
            status={dataMessage.status}
            show={showMessage}
          />
        ) : null}
        <div className="text-2xl mb-4">Add Category</div>
        <div className="grid grid-cols-2 gap-4 items-center">
          <label className="label">Name Category</label>
          <div className="">
            <input
              className="w-full border p-2"
              {...register('name')}
              placeholder="Name Category"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <label className="label">Slug</label>
          <div className="">
            <input
              className="w-full border p-2"
              {...register('slug')}
              placeholder="Slug"
            />
            {errors.slug && (
              <p className="text-sm text-red-500">{errors.slug.message}</p>
            )}
          </div>

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

export default FormCategory;
