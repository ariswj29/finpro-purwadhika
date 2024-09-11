'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import Image from 'next/image';
import { getCookies } from '@/helper/helper';

const inter = Inter({ subsets: ['latin'] });

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = () => {
      const cookies = getCookies();
      const token = cookies.token;

      if (cookies.user) {
        try {
          const users = JSON.parse(cookies.user);
          setUser(users);
          if (token && users) {
            setToken(token);
            if (users.role !== 'USER') {
              setIsAdmin(true);
            }
          }
        } catch (error) {
          console.error('Failed to parse cookies.user:', error);
          setUser(null);
        }
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <html lang="en">
        <body
          className={`${inter.className} flex items-center justify-center h-screen`}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="font-bold text-3xl">
              <Image src="/logo.png" alt="Groceria" width={250} height={75} />
            </div>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </body>
      </html>
    );
  }

  if (isAdmin) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <Navbar users={user} />
          {children}
          <Sidebar role={user.role} />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <Header token={token} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
