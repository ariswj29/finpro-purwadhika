import axios from 'axios';

const base_url_api = 'http://localhost:8000/api';

export async function updateProfile(id: Number, data: FormData) {
  const url = base_url_api + '/profile/' + id;
  console.log(data, 'dataapi');
  const response = await axios.put(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}
