import { getCookie } from '@/action/cookies';
import axios from 'axios';

const base_url_api = process.env.NEXT_PUBLIC_BASE_API_URL;

export async function getUsersProcess(search: string, page: number) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/users';
  const config = {
    params: {
      search,
      page,
    },
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  };
  const res = await axios.get(url, config);

  return res.data;
}

export async function createUserProcess(data: any) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/users';
  const res = await axios.post(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function getUserById(id: string) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/users/' + id;
  const res = await axios.get(url, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function updateUserProcess(id: string, data: any) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/users/' + id;
  const res = await axios.put(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function deleteUserProcess(id: number) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/users/' + id;
  const res = await axios.delete(url, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function getUserAdmin() {
  const authToken = await getCookie('token');
  const url = base_url_api + '/users/admin';
  const res = await axios.get(url, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}
