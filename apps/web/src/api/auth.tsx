import axios from 'axios';
import Cookies from 'js-cookie';

const base_url_api = 'http://localhost:8000/api';

export async function registerField(data: any) {
  const url = base_url_api + '/auth/register';
  const res = await axios.post(url, data);

  return res.data;
}

export async function login(data: any) {
  const url = base_url_api + '/auth/login';
  const res = await axios.post(url, data);

  return res.data;
}

export async function verificationEmail(data: any) {
  const url = base_url_api + '/auth/verification-email';
  const res = await axios.post(url, data);

  return res.data;
}

export async function confirmResetPassword(data: any) {
  const url = base_url_api + '/auth/confirm-reset-password';
  const res = await axios.post(url, data);

  return res.data;
}

export async function resetPassword(data: any) {
  const url = base_url_api + '/auth/reset-password';
  const res = await axios.post(url, data);

  return res.data;
}

export async function logout() {
  Cookies.remove('token');
  Cookies.remove('userId');
  Cookies.remove('user');
  Cookies.remove('nearestBranch');
  Cookies.remove('latitude');
  Cookies.remove('longitude');
}
