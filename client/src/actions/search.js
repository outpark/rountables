import axios from 'axios';
const ROOT_URL = `http://localhost:5000/api`

export const FETCH_TABLES = 'FETCH_TABLES';
export const FETCH_DETAIL_TABLES = 'FETCH_DETAIL_TABLES';

export function fetchTables(hashtag) {
  const URL = `${ROOT_URL}/search/hashtags`;

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

export function fetchDetailTables(hashtag, title) {
  const URL = `${ROOT_URL}/search/detail`;

  const request = axios({
    method: 'post',
    url: URL,
    data: {
      hashtags: hashtag,
      title: title
    }
  });

  return {
    type: FETCH_DETAIL_TABLES,
    payload: request
  }
}
