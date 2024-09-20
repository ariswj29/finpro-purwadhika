'use client';

import { resetPassword, verificationEmail } from '@/api/auth';
import { ShowMessage } from '@/components/ShowMessage';
import { verifyResetPasssword } from '@/schemas/verifyResetPassword.schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function ResetPasswordPage(context: any) {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(verifyResetPasssword),
  });

  const { searchParams } = context;
  const [dataMessage, setDataMessage] = useState({
    message: '',
    status: '',
  });
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const verifyPassword = async (formData: any) => {
    setLoading(true);
    console.log(formData, 'form data');
    try {
      const response = await resetPassword({ ...formData });
      setDataMessage(response);
    } catch (error) {
      setDataMessage({
        message: 'error',
        status: 'error',
      });
    } finally {
      setLoading(false);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        window.location.href = '/auth/login';
      }, 20000);
    }
  };

  useEffect(() => {
    if (!searchParams?.token) {
      setDataMessage({
        message: 'Token not found. Please check your email link.',
        status: 'error',
      });
    }
  }, [searchParams?.token]);

  return (
    <section className="p-12 py-24 max-w-screen-xl mx-auto items-center">
      {showMessage && (
        <ShowMessage
          name={
            dataMessage.status === 'success'
              ? 'Send to email Success'
              : 'Send to email Failed'
          }
          desc={dataMessage.message}
          status={dataMessage.status}
          show={showMessage}
        />
      )}
      <div className="grid md:grid-cols-3 sm:grid-cols-1">
        <div className="p-12 sm:p-16 bg-secondary border border-secondary shadow-sm w-full">
          <h3 className="text-2xl font-bold ">Having trouble logging in? </h3>
          <p className="my-2">
            Enter your email, and we&apos;ll send you a link to get back into
            your account.
          </p>
        </div>
        <div className="col-span-2 p-4 bg-primary shadow-md w-full">
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
              <p className="text-xs text-red-500 m-1">{errors.email.message}</p>
            )}
          </div>
          <div className="p-5 ">
            <p className="my-1">
              Click the button below to send link reset password.
            </p>
            <button
              onClick={handleSubmit(verifyPassword)}
              disabled={loading}
              className="w-full py-2 px-3 bg-primary border border-secondary rounded-md hover:bg-secondary hover:font-bold mt-2"
            >
              {loading ? 'Verifying...' : 'Send to email'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
