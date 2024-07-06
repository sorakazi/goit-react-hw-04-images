import axios from 'axios';

const API_KEY = '43667057-3a723c15f5345c10cebb45902';
const BASE_URL = 'https://pixabay.com/api/';

export const getAPI = async (query, page) => {
  const url = `${BASE_URL}?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`;

  const response = await axios.get(url);

  return response.data;
};
