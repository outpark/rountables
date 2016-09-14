import axios from 'axios';

const ROOT_URL = `http://127.0.0.1:5000/api`
export const USER_SIGNUP = 'USER_SIGNUP';
export const ME_FROM_TOKEN = 'ME_FROM_TOKEN';
export const USER_LOGIN = 'USER_LOGIN';
export const ME_FROM_TOKEN_SUCCESS = 'ME_FROM_TOKEN_SUCCESS';
export const ME_FROM_TOKEN_FAILURE = 'ME_FROM_TOKEN_FAILURE';
export const RESET_TOKEN = 'RESET_TOKEN';

//log out user
export const USER_LOGOUT = 'USER_LOGOUT';

export function userSignUp(userInput) {
  const URL = `${ROOT_URL}/users/signup`;
  const request = axios({
    method: 'post',
    url: URL,
    data: {
      username: userInput.username,
      email: userInput.email,
      password: userInput.password,
      confirm: userInput.confirm
    }
  });
  return {
    type: USER_SIGNUP,
    payload: request
  };
}

export function userLogIn(userInput) {
  const URL = `${ROOT_URL}/users/signin`;
  const request = axios({
    method: 'post',
    url: URL,
    data: {
      email: userInput.email,
      password: userInput.password
    }
  });
  return {
    type: USER_LOGIN,
    payload: request
  };

}

export function meFromToken(tokenFromStorage) {
  //check if the token is still valid, if so, get me from the server
  const URL = `${ROOT_URL}/users/me`
  const request = axios.get(`${ROOT_URL}/users/me/${tokenFromStorage}`);

  return {
    type: ME_FROM_TOKEN,
    payload: request
  };
}

export function meFromTokenSuccess(currentUser) {
  return {
    type: ME_FROM_TOKEN_SUCCESS,
    payload: currentUser
  };
}

export function meFromTokenFailure(error) {
  return {
    type: ME_FROM_TOKEN_FAILURE,
    payload: error
  };
}

export function resetToken() {//used for logout
  return {
    type: RESET_TOKEN
  };
}
