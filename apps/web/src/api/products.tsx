import axios from 'axios';

const base_url_api = 'http://localhost:8000/api';

export async function getAllProducts(
  limit: number = 8,
  latitude?: number,
  longitude?: number,
) {
  const url = base_url_api + '/products';
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
