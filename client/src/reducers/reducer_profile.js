import { GET_USER } from '../actions/user';

const INITIAL_STATE = {info:null}
export default function (state = INITIAL_STATE, action) {
  switch (action.type){
    case GET_USER:
      // return state.concat([ action.payload.data ]);
      return Object.assign({}, state, {
        info: action.payload.data
      });
    default:
      return state;
  }
}
