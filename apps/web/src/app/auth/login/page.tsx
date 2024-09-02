'use client';

import { loginSchema } from '@/schemas/login.schema';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { login } from '@/api/auth';
import Cookies from 'js-cookie';
import { ShowMessage } from '@/components/ShowMessage';
import Link from 'next/link';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginPage() {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });

  const [dataMessage, setDataMessage] = useState({
    message: '',
    status: '',
    data: {},
  });

  const [showMessage, setShowMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formSubmit = async (formData: any) => {
    try {
      const response = await login(formData);
      const { data, status, token } = response;

      setShowMessage(true);
      setDataMessage(response);

      if (status === 'success') {
        Cookies.set('token', token, { expires: 1, secure: true });
        localStorage.setItem('user', JSON.stringify(data));

        setTimeout(() => {
          setShowMessage(false);

          if (data.role === 'USER') {
            window.location.href = '/';
          } else {
            window.location.href = '/admin/dashboard';
          }
        }, 3000);
      }
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="p-12 max-w-screen-xl mx-auto items-center">
      {showMessage === true ? (
        <ShowMessage
          name={
            dataMessage.status === 'success' ? 'Login Success' : 'Login Failed'
          }
          desc={dataMessage.message}
          status={dataMessage.status}
          show={showMessage}
        />
      ) : null}
      <div className="grid md:grid-cols-3 sm:grid-cols-1">
        <div className="p-12 sm:p-16 bg-secondary border border-secondary shadow-sm w-full">
          <h3 className="text-2xl font-bold ">Welcome to Login</h3>
          <p className="my-2">
            Login to your account and access for the features
          </p>
        </div>
        <div className="col-span-2 bg-primary shadow-md w-full">
          <form onSubmit={handleSubmit(formSubmit)} className="p-8">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                className="mt-1 block w-full px-3 py-2 border border-secondary rounded-md shadow-sm focus:outline-none sm:text-sm"
                {...register('email')}
                placeholder="Email"
              />
              {errors.email && (
                <p className="text-xs text-red-500 m-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-sm font-medium">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="flex justify-between">
                <input
                  className="mt-1 block w-full px-3 py-2 border border-secondary rounded-md shadow-sm focus:outline-none sm:text-sm"
                  {...register('password')}
                  placeholder="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                />
                <span
                  className="absolute right-3 mt-1 top-1/2 cursor-pointer transform"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 m-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-2 px-3 bg-secondary rounded-md hover:font-bold"
            >
              Login
            </button>
            <hr className="my-4" />
            <Link
              href="/auth/register"
              className="block w-full text-center py-2 px-3 bg-primary border border-secondary rounded-md hover:bg-secondary hover:font-bold"
            >
              Don{"'"}t have an account? Register here
            </Link>
          </form>
        </div>
      </div>
    </section>
  );
}
