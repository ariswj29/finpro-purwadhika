'use client';

import { registerField } from '@/api/auth';
import { ShowMessage } from '@/components/ShowMessage';
import { registerSchema } from '@/schemas/register.schema';

import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const router = useRouter();
  const [data, setData] = useState({
    username: '',
    role: '',
    email: '',
  });
  const [dataMessage, setDataMessage] = useState({
    message: '',
    status: '',
    data: {},
  });
  const [showMessage, setShowMessage] = useState(false);
  const formSubmit = async (formData: any) => {
    try {
      console.log(formData, 'formData');
      const response = await registerField({ ...formData });

      const { status, message } = response;

      setDataMessage(response);

      if (status === 'success') {
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);

          router.push('/auth/login');
        }, 3000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="p-12 max-w-screen-xl mx-auto items-center">
      {showMessage && (
        <ShowMessage
          name={
            dataMessage.status === 'success'
              ? 'Register Success'
              : 'Register Failed'
          }
          desc={dataMessage.message}
          status={dataMessage.status}
          show={showMessage}
        />
      )}
      <form onSubmit={handleSubmit(formSubmit)}>
        <div className="grid md:grid-cols-3 sm:grid-cols-1">
          <div className="p-12 sm:p-16 bg-secondary border border-secondary shadow-sm w-full">
            <h3 className="text-2xl font-bold ">Welcome to Register</h3>
            <p className="my-2">
              Register your account and access for the features
            </p>
          </div>
          <div className="col-span-2 p-4 bg-primary shadow-md w-full">
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                className="mt-1 block w-full px-3 py-2 border border-secondary rounded-md shadow-sm focus:outline-none sm:text-sm"
                {...register('username')}
                type="text"
                id="username"
                placeholder="Username"
              />
              {errors.username && (
                <p className="text-xs text-red-500 m-1">
                  {errors.username.message}
                </p>
              )}
            </div>
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
            <button
              type="submit"
              className="w-full py-2 px-3 bg-secondary rounded-md hover:font-bold"
            >
              Register
            </button>
            <hr className="my-4" />
            <Link
              href="/auth/login"
              className="block w-full text-center py-2 px-3 bg-primary border border-secondary rounded-md hover:bg-secondary hover:font-bold"
            >
              Have an account? Login here
            </Link>
            <button
              onClick={() => signIn('google')}
              className="mt-4 w-full py-2 px-3 bg-secondary rounded-md hover:font-bold"
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
