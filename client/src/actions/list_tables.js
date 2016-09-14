import axios from 'axios';

const ROOT_URL = `http://159.203.121.58:5000/api`


export const LIST_TABLES = 'LIST_TABLES';

export function listTables() {
  const url = `${ROOT_URL}/board`;
  const request = axios.get(url);

  return {
    type: LIST_TABLES,
    payload: request
  };
}
