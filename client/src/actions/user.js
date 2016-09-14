import axios from 'axios';
const ROOT_URL = `http://127.0.0.1:5000/api`;
export const GET_USER = 'GET_USER';
export const UPDATE_USER = 'UPDATE_USER';

export function getUser(username) {
  const request = axios.get(`${ROOT_URL}/user/${username}`);

  return {
    type: GET_USER,
    payload: request
  };
}

export function updateUser(newData, username) {
  const URL = `${ROOT_URL}/user/${username}`;
  const request = axios({
    method: 'put',
    url: URL,
    data: {
      which: newData.which,
      toWhat: newData.toWhat
    }
  });
  console.log(request);
  return {
    type: UPDATE_USER,
    payload: request
  };
}
