import axios from 'axios';

const base_url_api = 'http://localhost:8000/api';

export async function getAllWishlist() {
  const url = base_url_api + '/wishlist/';
  const res = await axios.get(url);

  console.log(res.data, 'res.data');
  return res.data;
}

export async function getWishlist(userId: number) {
  const url = base_url_api + '/wishlist/' + userId;
  const res = await axios.get(url);

  return res.data;
}

export async function getCount(userId: number) {
  const url = base_url_api + '/wishlist/count/' + userId;
  const res = await axios.get(url);

  return res.data;
}

export async function removeWishlist(id: number) {
  const url = base_url_api + '/wishlist/' + id;
  const res = await axios.delete(url);

  return res.data;
}

export async function addToWishlist(productId: number, userId: number) {
  const url = base_url_api + '/wishlist/';
  const res = await axios.post(url, {
    productId,
    userId,
  });

  return res.data;
}
