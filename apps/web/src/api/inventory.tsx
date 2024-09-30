import { getCookie } from '@/action/cookies';
import axios from 'axios';

const base_url_api = process.env.NEXT_PUBLIC_BASE_API_URL;

export async function getInventory(
  search?: string,
  page: number = 1,
  userId?: number,
  limit: number = 10,
) {
  console.log('userId', userId);
  const authToken = await getCookie('token');
  const url = base_url_api + '/inventory';
  const res = await axios.get(url, {
    params: {
      search,
      page,
      userId,
      limit,
    },
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });
  return res.data;
}

export async function createInventory(data: any) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/inventory';
  const res = await axios.post(url, data, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function getInventoryById(id: number) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/inventory/' + id;
  const res = await axios.get(url, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function updateInventory(id: string, data: any) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/inventory/' + id;
  const res = await axios.put(url, data, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function deleteInventory(id: string) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/inventory/' + id;
  const res = await axios.delete(url, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function getBranchByUserId(userId: number) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/inventory/branch/' + userId;
  const res = await axios.get(url, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function getJournals(page: number = 1, limit: number = 10) {
  const authToken = await getCookie('token');
  const userId = await getCookie('userId');
  const url = base_url_api + '/journal';
  const res = await axios.get(url, {
    params: {
      page,
      limit,
      userId,
    },
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function getMutations(
  search: string,
  page: number = 1,
  limit: number = 10,
) {
  const authToken = await getCookie('token');
  const userId = await getCookie('userId');
  const url = base_url_api + '/mutation';
  const res = await axios.get(url, {
    params: {
      search,
      page,
      limit,
      userId,
    },
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function getMutationById(id: number) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/mutation/' + id;
  const res = await axios.get(url, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function createMutation(data: any) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/mutation';
  const res = await axios.post(url, data, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}

export async function updateMutation(id: string, data: any) {
  const authToken = await getCookie('token');
  const url = base_url_api + '/mutation/' + id;
  const res = await axios.put(url, data, {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  });

  return res.data;
}
