import { getCookie } from '../action/cookies';
import axios from 'axios';

const base_url_api = process.env.NEXT_PUBLIC_BASE_API_URL;

export const getDashboardData = async () => {
  const authToken = await getCookie('token');
  const usesId = await getCookie('userId');
  const url = base_url_api + '/dashboard';
  const res = await axios.get(url, {
    params: {
      userId: usesId,
    },
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });
  return res.data;
};
