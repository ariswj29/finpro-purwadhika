import { getCookie } from '@/action/cookies';
import axios from 'axios';

const base_url_api = process.env.NEXT_PUBLIC_BASE_API_URL;

export async function getAllProducts(
  limit: number = 8,
  latitude?: number,
  longitude?: number,
) {
  const url = base_url_api + '/products/homepage';
  const res = await axios.get(url, {
    params: {
      limit,
      latitude,
      longitude,
    },
  });

  return res.data;
}

export async function getAllCategories() {
  const url = base_url_api + '/products/categories';
  const res = await axios.get(url);

  return res.data;
}

export async function getAllListProducts(
  search?: string,
  category?: string,
  page: number = 1,
  limit: number = 4,
) {
  const url = base_url_api + '/products/allproducts';
  const res = await axios.get(url, {
    params: {
      search,
      category,
      page,
      limit,
    },
  });

  return res.data;
}

export async function getProducts(
  search?: string,
  page: number = 1,
  limit: number = 10,
) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/products';
  const res = await axios.get(url, {
    params: {
      search,
      page,
      limit,
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
