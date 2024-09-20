import { getCookie } from '@/action/cookies';
import axios from 'axios';

const base_url_api = process.env.NEXT_PUBLIC_BASE_API_URL;

export async function getInventory(
  search?: string,
  page: number = 1,
  limit: number = 10,
) {
  const authToken = await getCookie('token');
  const userId = await getCookie('userId');
  const url = base_url_api + '/inventory';
  const res = await axios.get(url, {
    params: {
      search,
      page,
      limit,
      userId,
    },
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });
  return res.data;
}

export async function createProduct(data: any) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/products';
  const res = await axios.post(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function getProductById(id: string) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/products/' + id;
  const res = await axios.get(url, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function updateProduct(id: string, data: any) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/products/' + id;
  const res = await axios.put(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function deleteProduct(id: string) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/products/' + id;
  const res = await axios.delete(url, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}
