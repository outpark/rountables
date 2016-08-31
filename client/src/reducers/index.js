import { combineReducers } from 'redux';
import TableListReducer from './reducer_tables';
import UserReducer from './reducer_user';
import { reducer as formReducer } from 'redux-form';
// import SearchListReducer from './reducer_search_list';

const rootReducer = combineReducers({
  tableList: TableListReducer,
  user: UserReducer,
  form: formReducer
});

export default rootReducer;
