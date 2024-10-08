import { getCookie } from '@/action/cookies';
import axios from 'axios';

const base_url_api = process.env.NEXT_PUBLIC_BASE_API_URL;

export async function getProfile(id: number) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/profile/' + id;
  const res = await axios.get(url, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function updateProfile(id: Number, data: FormData) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/profile/' + id;
  const response = await axios.put(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + authToken,
    },
  });

  return response.data;
}

export async function verifyEmail(id: Number, data: FormData) {
  const url = base_url_api + '/profile/update-email/' + id;
  const response = await axios.put(url, data);

  return response.data;
}
export async function updateNewEmail(id: Number, data: any) {
  const url = base_url_api + '/profile/verification-email/' + id;
  const response = await axios.put(url, data);

  return response.data;
}
