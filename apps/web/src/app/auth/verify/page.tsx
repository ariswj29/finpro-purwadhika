'use client';

import { verificationEmail } from '@/api/auth';
import { ShowMessage } from '@/components/ShowMessage';
import { use } from 'chai';
import { useState, useEffect } from 'react';

export default function VerifyPage(context: any) {
  const { searchParams } = context;
  const [dataMessage, setDataMessage] = useState({
    message: '',
    status: '',
  });
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const verifyEmail = async () => {
    setLoading(true);
    try {
      const token = searchParams?.token;
      if (token) {
        const response = await verificationEmail({ token });
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
              onClick={verifyEmail}
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
