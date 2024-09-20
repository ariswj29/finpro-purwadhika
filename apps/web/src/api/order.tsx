import { getCookie } from '@/action/cookies';
import axios from 'axios';

const base_url_api = process.env.NEXT_PUBLIC_BASE_API_URL;

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
  const authToken = await getCookie('token');
  const url = base_url_api + '/orders/user/' + userId;
  const res = await axios.get(url, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function getOrderComplete(userId: number) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/orders/complete/' + userId;
  const res = await axios.get(url, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function getOrderDetail(orderId: number) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/orders/' + orderId;
  const res = await axios.get(url, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function createOrder(data: any) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/orders';
  const res = await axios.post(url, data, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function uploadPayment(orderId: number, data: FormData) {
  const authToken = await getCookie('token');
  const url = `${base_url_api}/orders/upload-payment/${orderId}`;
  const res = await axios.put(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function confirmPayment(orderId: number, data: any) {
  const authToken = await getCookie('token');
  const url = `${base_url_api}/orders/confirm-payment/${orderId}`;
  const res = await axios.put(url, data, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function cancelOrder(orderId: number) {
  const authToken = await getCookie('token');
  const url = `${base_url_api}/orders/cancel-order/${orderId}`;
  const res = await axios.put(
    url,
    { status: 'CANCELED' },
    {
      headers: {
        Authorization: 'Bearer ' + authToken,
      },
    },
  );

  return res.data;
}

export async function sendOrder(orderId: number) {
  const authToken = await getCookie('token');
  const url = `${base_url_api}/orders/send-order/${orderId}`;
  const res = await axios.put(
    url,
    { status: 'SHIPPED' },
    {
      headers: {
        Authorization: 'Bearer ' + authToken,
      },
    },
  );

  return res.data;
}

export async function confirmOrder(orderId: number) {
  const authToken = await getCookie('token');
  const url = `${base_url_api}/orders/confirm-order/${orderId}`;
  const res = await axios.put(
    url,
    { status: 'DELIVERED' },
    {
      headers: {
        Authorization: 'Bearer ' + authToken,
      },
    },
  );

  return res.data;
}
