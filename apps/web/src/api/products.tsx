import axios from 'axios';

const base_url_api = 'http://localhost:8000/api';

export async function getAllProducts(limit: number = 8) {
  const url = base_url_api + '/products';
  const res = await axios.get(url, {
    params: {
      limit,
    },
  });

  return res.data;
}
