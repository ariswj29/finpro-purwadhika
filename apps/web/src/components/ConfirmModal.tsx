import { useState } from 'react';
import { cancelOrder } from '@/api/order';

export default function ConfirmModal(props: {
  id: number;
  setModal: any;
  title: string;
  for: string;
}) {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleDelete = async () => {
    try {
      const response = await cancelOrder(props.id);

      const { status } = response;

      if (status == 'success') {
        showToast('Success cancel order');
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {toastVisible && (
        <div className="toast toast-top toast-end top-[3rem]">
          <div className="alert alert-info">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className={`bg-white p-8 rounded-lg shadow-lg z-10 border-t-8`}>
        <h3 className="text-xl font-bold">Confirm {props.title}</h3>
        <p className="my-2">Are you sure to {props.title} this data?</p>
        <div className="grid grid-cols-2 gap-2 items-center text-center">
          <a
            className="p-2 my-4 border bg-secondary rounded-md cursor-pointer hover:font-bold"
            onClick={() => handleDelete()}
          >
            Yes
          </a>
          <a
            className="p-2 border border-secondary rounded-md cursor-pointer hover:font-bold"
            onClick={() => props.setModal(false)}
          >
            Cancel
          </a>
        </div>
      </div>
    </div>
  );
}
