import { getCookie } from '@/action/cookies';
import axios from 'axios';

const base_url_api = 'http://localhost:8000/api';

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
