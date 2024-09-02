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
