import { getCookie } from '@/action/cookies';
import axios from 'axios';

const base_url_api = 'http://localhost:8000/api';

export async function addAddress(data: any) {
  const url = base_url_api + '/address';
  const res = await axios.post(url, data);

  return res.data;
}

export async function getAddress(userId: number) {
  const url = base_url_api + `/address?userId=${userId}`;
  const res = await axios.get(url);

  return res.data;
}

export async function getProvince() {
  const url = base_url_api + '/address/province';
  const res = await axios.get(url);

  return res.data;
}

export async function getCity(provinceId: number) {
  const url = base_url_api + `/address/city?provinceId=${provinceId}`;
  const res = await axios.get(url);

  return res.data;
}

export async function addressDetail(id: string) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/address/' + id;
  const res = await axios.get(url, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function editAddress(id: string, data: any) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/address/' + id;
  const res = await axios.put(url, data, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function deleteAddress(id: number) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/address/' + id;
  const res = await axios.delete(url, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function setPrimaryAddress(id: number, data: any) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/address/primary-address/' + id;
  const res = await axios.put(url, data, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}
