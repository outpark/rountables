import axios from 'axios';
const ROOT_URL = `http://localhost:5000/api`
export const FETCH_TABLES = 'FETCH_TABLES';

export function fetchTables(hashtag) {
  const URL = `${ROOT_URL}/search/hashtags`;
  // const request = axios.get(url);

  const request = axios({
    method: 'post',
    url: URL,
    data: {
      hashtags: hashtag
    }
  });

  return {
    type: FETCH_TABLES,
    payload: request
  };
}
