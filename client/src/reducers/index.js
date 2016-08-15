import { combineReducers } from 'redux';
import TableListReducer from './reducer_tables';
// import SearchListReducer from './reducer_search_list';

const rootReducer = combineReducers({
  tableList: TableListReducer
});

export default rootReducer;
