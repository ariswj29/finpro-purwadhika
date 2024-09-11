import { getCookie } from '@/action/cookies';
import axios from 'axios';

const base_url_api = 'http://localhost:8000/api';

export async function getAllWishlist() {
  const url = base_url_api + '/wishlist/';
  const res = await axios.get(url);

  return res.data;
}

export async function getWishlist(userId: number) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/wishlist/' + userId;
  const res = await axios.get(url, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function getCount(userId: number) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/wishlist/count/' + userId;
  const res = await axios.get(url, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function removeWishlist(id: number) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/wishlist/' + id;
  const res = await axios.delete(url, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function addToWishlist(productId: number, userId: number) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/wishlist/';
  const res = await axios.post(
    url,
    {
      productId,
      userId,
    },
    {
      headers: {
        Authorization: 'Bearer ' + authToken,
      },
    },
  );

  return res.data;
}
