'use client';

import { updateNewEmail } from '@/api/profile';
import { ShowMessage } from '@/components/ShowMessage';
import { getCookies } from '@/helper/helper';
import { verifyResetPasssword } from '@/schemas/verifyResetPassword.schema';
import { yupResolver } from '@hookform/resolvers/yup';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function UpdateEmailPage(context: any) {
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

  const updateEmail = async (data: any) => {
    setLoading(true);
    try {
      const token = searchParams?.token;
      const cookies = getCookies();
      if (token) {
        const response = await updateNewEmail(Number(cookies.userId), {
          token,
        });
        console.log(response, 'response verify');
        Cookies.set('user', JSON.stringify(response.data), {
          expires: 1,
          secure: true,
        });
        setDataMessage(response);
      } else {
        throw new Error('Invalid or missing token');
      }
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
          <h3 className="text-2xl font-bold ">Welcome to Verify</h3>
          <p className="my-2">
            Email verification is required to access the application.
          </p>
        </div>
        <div className="col-span-2 bg-primary shadow-md w-full">
          <div className="p-12 sm:p-16">
            <p className="my-2">
              Click the button below to verify your email address.
            </p>
            <button
              onClick={updateEmail}
              disabled={loading}
              className="w-full py-2 px-3 bg-primary border border-secondary rounded-md hover:bg-secondary hover:font-bold mt-4"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
