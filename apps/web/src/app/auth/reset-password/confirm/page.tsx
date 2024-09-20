'use client';

import { confirmResetPassword, verificationEmail } from '@/api/auth';
import { ShowMessage } from '@/components/ShowMessage';
import { passwordSchema } from '@/schemas/password.schema';
import { verifyResetPasssword } from '@/schemas/verifyResetPassword.schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ConfirmResetPasswordPage(context: any) {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const { searchParams } = context;
  const [dataMessage, setDataMessage] = useState({
    message: '',
    status: '',
  });
  const [showMessage, setShowMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetPassword = async (formData: any) => {
    setLoading(true);
    try {
      const token = searchParams?.token;
      if (token) {
        const response = await confirmResetPassword({ token, ...formData });
        setDataMessage(response);
      } else {
        throw new Error('Invalid or missing token');
      }
    } catch (error) {
      setDataMessage({
        message: (error as any).response.data.message,
        status: 'error',
      });
    } finally {
      setLoading(false);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        window.location.href = '/auth/login';
      }, 3000);
    }
  };

  useEffect(() => {
    if (!searchParams?.token) {
      setDataMessage({
        message: 'Token not found. Please check your email link.',
        status: 'error',
      });
      setShowMessage(true);
    }
  }, [searchParams?.token]);

  return (
    <section className="p-12 py-24 max-w-screen-xl mx-auto items-center">
      {showMessage && (
        <ShowMessage
          name={
            dataMessage.status === 'success'
              ? 'Verify Success'
              : 'Verify Failed'
          }
          desc={dataMessage.message}
          status={dataMessage.status}
          show={showMessage}
        />
      )}
      <div className="grid md:grid-cols-3 sm:grid-cols-1">
        <div className="p-12 sm:p-16 bg-secondary border border-secondary shadow-sm w-full">
          <h3 className="text-2xl font-bold ">Reset your Password</h3>
          <p className="my-2">
            Please reset your password to secure your account.
          </p>
        </div>
        <div className="col-span-2 p-4 bg-primary shadow-md w-full">
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-sm font-medium">
              New Password <span className="text-red-500">*</span>
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
          <div className="mb-4 relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium"
            >
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <div className="flex justify-between">
              <input
                className="mt-1 block w-full px-3 py-2 border border-secondary rounded-md shadow-sm focus:outline-none sm:text-sm"
                {...register('confirmPassword')}
                placeholder="Confirm Password"
                type={showPassword ? 'text' : 'confirmPassword'}
                id="confirmPassword"
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
          <div className="p-5 ">
            <p className="my-1">
              Click the button below to submit your new password.
            </p>
            <button
              onClick={handleSubmit(resetPassword)}
              disabled={loading}
              className="w-full py-2 px-3 bg-primary border border-secondary rounded-md hover:bg-secondary hover:font-bold mt-2"
            >
              {loading ? 'Verifying...' : 'Reset Password'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
