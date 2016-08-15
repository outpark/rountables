import { FETCH_TABLES } from '../actions/search';
import { LIST_TABLES } from '../actions/list_tables'

export default function (state = [], action) {
  // console.log('Action received', action);
  // maybe find a way to concatenate searches when multiple hashtag searches
  switch (action.type){
    case FETCH_TABLES:
      // return state.concat([ action.payload.data ]);
      return Object.assign({}, state, {
        tables: action.payload.data.data
      });
    case LIST_TABLES:
      return Object.assign({}, state, {
        tables: action.payload.data.data
      });
  }

  return state;
}
