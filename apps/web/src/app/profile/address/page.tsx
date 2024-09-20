'use client';
import { getCookies } from '@/helper/helper';
import { Address } from '@/interface/address.interface';
import { useEffect, useState } from 'react';
import { FaPen, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import Link from 'next/link';
import { getAddress, setPrimaryAddress } from '@/api/address';
import ConfirmModal from '@/components/ConfirmModal';
import NotificationToast from '@/components/NotificationToast';

export default function AddressPage() {
  const cookies = getCookies();
  const [data, setData] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [id, setId] = useState<number>(0);
  const [forModal, setFor] = useState<string>('');
  const [notif, setNotif] = useState<{ message: string; status: string }>({
    message: '',
    status: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAddress(Number(cookies.userId));
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleSetPrimary = async (addressId: number) => {
    try {
      const response = await setPrimaryAddress(addressId, {
        userId: Number(cookies.userId),
      });
      showToast(response);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Failed to set primary address', error);
    }
  };

  const showToast = (data: { message: string; status: string }) => {
    setNotif(data);
    setTimeout(() => {
      setNotif({ message: '', status: '' });
    }, 3000);
  };

  return (
    <div className="stats stats-vertical shadow container mx-auto px-4">
      <NotificationToast toastMessage={notif} />
      <div className="flex justify-between items-center gap-4">
        <div className="flex">
          <div className=" pl-6 stat-value text-xl">My Address</div>
        </div>
        <Link
          href={'/profile/address/add'}
          className="bg-secondary hover:bg-yellow-400 p-2 px-4 my-2 rounded-lg"
        >
          <span className="flex items-center">
            <FaPlus /> &nbsp; Add New Address
          </span>
        </Link>
      </div>
      {loading ? (
        <div>
          <div className="skeleton h-32 text-center p-4 font-bold">
            Loading...
          </div>
        </div>
      ) : data.length === 0 ? (
        <div>
          <div className="text-center p-4 font-bold">Address is empty</div>
        </div>
      ) : (
        data.map((item, index) => (
          <div key={index} className="stat flex justify-between">
            <div>
              <div className="stat-value text-sm">{item.name}</div>
              <div className="stat-desc text-sm">{item.address}</div>
              <div className="stat-desc text-sm">
                {item.city.name}, {item.province.name}, {item.postalCode}
              </div>
              {item.isPrimary && (
                <div className="font-bold text-sm pt-2 text-secondary">
                  {' '}
                  Primary Address{' '}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2">
              <div className="justify-self-end">
                <Link href={`/profile/address/${item.id}`}>
                  <button className="bg-secondary hover:bg-yellow-600 text-primary p-1 rounded-md">
                    <FaPen />
                  </button>
                </Link>
              </div>
              <div>
                <button
                  onClick={() => {
                    setConfirmationModal(true);
                    setId(item.id);
                    setFor('address');
                  }}
                  className="bg-black hover:bg-red-600 text-primary p-1 rounded-md ml-2"
                >
                  <FaTrash />
                </button>
              </div>
              <div className="col-span-2">
                <button
                  onClick={() => handleSetPrimary(item.id)}
                  className="btn btn-xs py-1 px-2 rounded ml-2"
                  disabled={item.isPrimary ? true : false}
                >
                  Set as primary
                </button>
              </div>
            </div>
            {confirmationModal && (
              <ConfirmModal
                id={id}
                setModal={setConfirmationModal}
                title={forModal}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}
