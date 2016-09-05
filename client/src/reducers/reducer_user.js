import {  ME_FROM_TOKEN, ME_FROM_TOKEN_SUCCESS,
   ME_FROM_TOKEN_FAILURE, RESET_TOKEN,
 } from '../actions/auth';

const INITIAL_STATE = {user: null, status:null, error:null, loading: false};


export default function(state = INITIAL_STATE, action) {
  let error;
  switch(action.type){

    case ME_FROM_TOKEN:// loading currentUser("me") from jwttoken in local/session storage storage,
      return { ...state, user: null, status:'storage', error:null, loading: true};
    case ME_FROM_TOKEN_SUCCESS://return user, status = authenticated and make loading = false
      return { ...state, user: action.payload, status:'authenticated', error:null, loading: false}; //<-- authenticated
    case ME_FROM_TOKEN_FAILURE:// return error and make loading = false
     error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
      return { ...state, user: null, status:'storage', error:error, loading: false};
    case RESET_TOKEN:// remove token from storage make loading = false
      return { ...state, user: null, status:'storage', error:null, loading: false};

    default:
      return state;
  }
}
