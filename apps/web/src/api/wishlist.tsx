import axios from 'axios';

const base_url_api = 'http://localhost:8000/api';

export async function getAllWishlist() {
  const url = base_url_api + '/wishlist/';
  const res = await axios.get(url);

  console.log(res.data, 'res.data');
  return res.data;
}

export async function getCount() {
  const url = base_url_api + '/wishlist/count';
  const res = await axios.get(url);

  return res.data;
}

export async function removeWishlist(id: number) {
  const url = base_url_api + '/wishlist/' + id;
  const res = await axios.delete(url);

  return res.data;
}
