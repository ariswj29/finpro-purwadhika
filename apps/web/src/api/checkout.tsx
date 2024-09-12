import { getCookie } from '@/action/cookies';
import axios from 'axios';

const base_url_api = 'http://localhost:8000/api';

export async function calShippingCost(data: any) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/checkout';
  const res = await axios.post(url, data, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}
