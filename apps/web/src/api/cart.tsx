import axios from 'axios';

const base_url_api = 'http://localhost:8000/api';

export async function getAllCart() {
  const url = base_url_api + '/cart/';
  const res = await axios.get(url);

  return res.data;
}

export async function removeCart(id: number) {
  const url = base_url_api + '/cart/remove-cart/' + id;
  const res = await axios.put(url);

  return res.data;
}
