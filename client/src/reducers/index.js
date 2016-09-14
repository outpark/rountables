import { combineReducers } from 'redux';
import TableListReducer from './reducer_tables';
import UserReducer from './reducer_user';
import { reducer as formReducer } from 'redux-form';
import ProfileReducer from './reducer_profile';
import PostReducer from './reducer_posts'
// import SearchListReducer from './reducer_search_list';

const rootReducer = combineReducers({
  tableList: TableListReducer,
  userData: UserReducer,
  form: formReducer,
  profileData: ProfileReducer,
  postList: PostReducer
});

export default rootReducer;
