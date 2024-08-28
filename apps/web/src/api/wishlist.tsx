import axios from 'axios';

const base_url_api = 'http://localhost:8000/api';

export async function getAllWishlist() {
  const url = base_url_api + '/wishlist/';
  const res = await axios.get(url);

  console.log(res.data, 'res.data');
  return res.data;
}
