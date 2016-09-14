import { FETCH_TABLES, FETCH_DETAIL_TABLES } from '../actions/search';
import { LIST_TABLES } from '../actions/list_tables';
import { GET_TABLE } from '../actions/table';

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
    case FETCH_DETAIL_TABLES:
      return Object.assign({}, state, {
        tables: action.payload.data.data
      });
    case GET_TABLE:
    return Object.assign({}, state, {
      tables: action.payload.data.table
    });
  }

  return state;
}
