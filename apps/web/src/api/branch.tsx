import { getCookie } from '@/action/cookies';
import axios from 'axios';

const base_url_api = process.env.NEXT_PUBLIC_BASE_API_URL;

export async function getAllBranches(search: string, page: number) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/branch';
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

export async function createBranch(data: any) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/branch';
  const res = await axios.post(url, data, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function getBranch(id: number) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/branch/' + id;
  const res = await axios.get(url, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function updateBranch(id: string, data: any) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/branch/' + id;
  const res = await axios.put(url, data, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function deleteBranch(id: number) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/branch/' + id;
  const res = await axios.delete(url, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}
