import axios from 'axios';

const base_url_api = 'http://localhost:8000/api';

export async function getAllOrders(
  search?: string,
  branchId?: number,
  page: number = 1,
  limit: number = 10,
) {
  const url = base_url_api + '/orders';
  const res = await axios.get(url, {
    params: {
      search,
      branchId,
      page,
      limit,
    },
  });
  return res.data;
}

export async function getAllOrder(userId: number) {
  const url = base_url_api + '/orders/user/' + userId;
  const res = await axios.get(url);

  return res.data;
}

export async function getOrderComplete(userId: number) {
  const url = base_url_api + '/orders/complete/' + userId;
  const res = await axios.get(url);

  return res.data;
}

export async function getOrderDetail(orderId: number) {
  const url = base_url_api + '/orders/' + orderId;
  const res = await axios.get(url);

  return res.data;
}

export async function createOrder(data: any) {
  const url = base_url_api + '/orders';
  const res = await axios.post(url, data);

  return res.data;
}

export async function uploadPayment(orderId: number, data: FormData) {
  const url = `${base_url_api}/orders/upload-payment/${orderId}`;
  const res = await axios.put(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log(res, 'res api');

  return res.data;
}

export async function confirmPayment(orderId: number, data: any) {
  const url = `${base_url_api}/orders/confirm-payment/${orderId}`;
  const res = await axios.put(url, data);

  return res.data;
}

export async function cancelOrder(orderId: number) {
  const url = `${base_url_api}/orders/cancel-order/${orderId}`;
  const res = await axios.put(url, { status: 'CANCELED' });

  return res.data;
}

export async function sendOrder(orderId: number) {
  const url = `${base_url_api}/orders/send-order/${orderId}`;
  const res = await axios.put(url, { status: 'SHIPPED' });

  return res.data;
}

export async function confirmOrder(orderId: number) {
  const url = `${base_url_api}/orders/confirm-order/${orderId}`;
  const res = await axios.put(url, { status: 'DELIVERED' });

  return res.data;
}
