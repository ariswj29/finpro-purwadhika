import { getCookie } from '@/action/cookies';
import axios from 'axios';

const base_url_api = process.env.NEXT_PUBLIC_BASE_API_URL;

export async function getAllCart() {
  const url = base_url_api + '/cart/';
  const res = await axios.get(url);

  return res.data;
}

export async function getCart(userId: number) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/cart/' + userId;
  const res = await axios.get(url, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function addCart(productId: number, userId: number) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/cart';
  const res = await axios.post(
    url,
    { productId, userId },
    {
      headers: {
        Authorization: 'Bearer ' + authToken,
      },
    },
  );

  return res.data;
}

export async function updateCart(id: number) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/cart/update-cart/' + id;
  const res = await axios.put(
    url,
    {},
    {
      headers: {
        Authorization: 'Bearer ' + authToken,
      },
    },
  );

  return res.data;
}
