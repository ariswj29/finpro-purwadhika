'use client';

import { FaMoneyBill, FaTicketAlt, FaUsers } from 'react-icons/fa';
import ChartBar from '@/components/ChartBar';
import ChartLine from '@/components/ChartLine';
import { useEffect, useState } from 'react';
import { formattedMoney, getCookies } from '@/helper/helper';
import { getDashboardData } from '@/api/dashboard';

export default function DashboardPage() {
  const cookies = getCookies();
  const user = JSON.parse(cookies.user || '{}');
  const [data, setData] = useState({
    totalProduct: 0,
    totalSales: 0,
    totalStock: 0,
    salesPerProduct: [],
    stockPerProduct: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardData();
        setData(response);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <div className="text-2xl mb-4">Dashboard</div>
      <div className="text-md mb-4">
        Your login with role:{' '}
        {user.role == 'SUPER_ADMIN' ? 'SUPER ADMIN' : user.role}
      </div>
      <div className="grid grid-cols-3 gap-4 items-center justify-center">
        {user.role == 'SUPER_ADMIN' && (
          <>
            <div className="p-8 border border-secondary rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaUsers className="text-4xl text-blue-400" />
                  <div className="text-md ml-2">Total Users</div>
                </div>
                <div className="text-xl font-bold">15</div>
              </div>
            </div>
            <div className="p-8 border border-secondary rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaUsers className="text-4xl text-green-400" />
                  <div className="text-md ml-2">Total Admin</div>
                </div>
                <div className="text-xl font-bold">8</div>
              </div>
            </div>
            <div className="p-8 border border-secondary rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaUsers className="text-4xl text-yellow-400" />
                  <div className="text-md ml-2">Total Customer</div>
                </div>
                <div className="text-xl font-bold">7</div>
              </div>
            </div>
          </>
        )}
        <div className="p-8 border border-secondary rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaTicketAlt className="text-4xl text-blue-400" />
              <div className="text-md ml-2">Total Product</div>
            </div>
            <div className="text-xl font-bold">
              {data?.totalProduct ? data?.totalProduct : 0}
            </div>
          </div>
        </div>
        <div className="p-8 border border-secondary rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaTicketAlt className="text-4xl text-green-400" />
              <div className="text-md ml-2">Total Sales</div>
            </div>
            <div className="text-xl font-bold">
              {data?.totalSales ? formattedMoney(data?.totalSales) : 0}
            </div>
          </div>
        </div>
        <div className="p-8 border border-secondary rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaTicketAlt className="text-4xl text-yellow-400" />
              <div className="text-md ml-2">Total Stock</div>
            </div>
            <div className="text-xl font-bold">
              {data?.totalStock ? data?.totalStock : 0}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="p-8 border border-secondary rounded-lg">
          <ChartBar data={data?.salesPerProduct} />
        </div>
        <div className="p-8 border border-secondary rounded-lg">
          <ChartLine data={data?.stockPerProduct} />
        </div>
      </div>
    </div>
  );
}
