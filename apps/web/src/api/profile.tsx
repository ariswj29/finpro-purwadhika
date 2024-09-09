import axios from 'axios';

const base_url_api = 'http://localhost:8000/api';

export async function getProfile(id: number) {
  const url = base_url_api + '/profile/' + id;
  const res = await axios.get(url);

  return res.data;
}

export async function updateProfile(id: Number, data: FormData) {
  const url = base_url_api + '/profile/' + id;
  const response = await axios.put(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
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
