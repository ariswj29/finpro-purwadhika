'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useRouter } from 'next/navigation';
import { ShowMessage } from '@/components/ShowMessage';
import { productsSchema } from '@/schemas/products.schema';
import {
  createProduct,
  getAllCategories,
  getProductById,
  updateProduct,
} from '@/api/products';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
}

const FormProduct = () => {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(productsSchema),
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
  const [categories, setCategories] = useState<Category[]>([]);

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
    const fetchcategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    if (userId != 'add') {
      getProductById(userId || '')
        .then((data) => {
          reset(data.data);
          console.log(data);
          setPreview(
            `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/products/` +
              data.data.image,
          );
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
        });
    }

    fetchcategories();
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
        response = await updateProduct(userId || '', formDataToSend);
      } else {
        response = await createProduct(formDataToSend);
      }

      setShowMessage(true);
      setDataMessage(response);

      setTimeout(() => {
        setShowMessage(false);
        router.push('/admin/products');
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
              dataMessage.message === 'success create product'
                ? 'Add Data Success'
                : dataMessage.message === 'success update product'
                  ? 'Edit Data Success'
                  : 'Failed'
            }
            desc={dataMessage.message}
            status={dataMessage.status}
            show={showMessage}
          />
        ) : null}
        <div className="text-2xl mb-4">Add Product</div>
        <div className="grid grid-cols-2 gap-4 items-center">
          <label className="label">Name Product</label>
          <div className="">
            <input
              className="w-full border p-2"
              {...register('name')}
              placeholder="Name Product"
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

          <label className="label">Price</label>
          <div className="">
            <input
              className="w-full border p-2"
              {...register('price')}
              placeholder="Price"
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          <label className="label">Description</label>
          <div className="">
            <input
              className="w-full border p-2"
              {...register('description')}
              placeholder="Description"
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <label className="label">Category</label>
          <div className="">
            <select className="w-full border p-2" {...register('categoryId')}>
              <option value="" disabled selected>
                Select Category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-sm text-red-500">
                {errors.categoryId.message}
              </p>
            )}
          </div>

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

export default FormProduct;
