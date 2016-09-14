import { LIST_POSTS } from '../actions/table';

export default function (state = [], action) {
  // console.log('Action received', action);
  // maybe find a way to concatenate searches when multiple hashtag searches
  switch (action.type){
    case LIST_POSTS:
      // return state.concat([ action.payload.data ]);
      return Object.assign({}, state, {
        posts: action.payload.data.data
      });
  }

  return state;
}
