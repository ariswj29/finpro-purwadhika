import { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { DetailOrder } from './DetailOrder';

export default function ActionOrder({ order }: any) {
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [openPayment, setOpenPayment] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [id, setId] = useState<number>(0);
  const [forModal, setFor] = useState<string>('');

  const handleOpenDetail = (order: any) => {
    setSelectedOrder(order);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedOrder(null);
  };
  return (
    <div className="dropdown dropdown-end">
      {openDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-70"></div>
          <DetailOrder
            show={openDetail}
            order={selectedOrder}
            onClose={handleCloseDetail}
          />
        </div>
      )}
      <div tabIndex={0} role="button" className="">
        <FaBars />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-32 p-2 shadow"
      >
        <li className="my-1">
          <a
            className="font-semibold bg-slate-300"
            onClick={() => handleOpenDetail(order)}
          >
            Detail
          </a>
        </li>
        {order.paymentStatus == 'UNPAID' && (
          <li className="my-1">
            <a
              className="font-semibold bg-red-400"
              onClick={() => {
                setConfirmationModal(true);
                setId(order.id);
                setFor('cancel order');
              }}
            >
              Cancel Order
            </a>
          </li>
        )}
        {order.paymentStatus == 'PAID' && (
          <li className="my-1">
            <a
              className="font-semibold bg-green-400"
              onClick={() => {
                setConfirmationModal(true);
                setId(order.id);
                setFor('received order');
              }}
            >
              Confirm Payment
            </a>
          </li>
        )}
        {order.paymentStatus == 'PROCESSING' && (
          <li className="my-1">
            <a
              className="font-semibold bg-green-400"
              onClick={() => {
                setConfirmationModal(true);
                setId(order.id);
                setFor('received order');
              }}
            >
              Send Order
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}
