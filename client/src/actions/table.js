import axios from 'axios';

const ROOT_URL = `http://127.0.0.1:5000/api`
export const CREATE_NEW_TABLE = 'CREATE_NEW_TABLE';
export const GET_TABLE = 'GET_TABLE';
export const NEW_POST = 'NEW_POST';
export const LIST_POSTS = 'LIST_POSTS';
export const JOIN_TABLE = 'JOIN_TABLE';
export const DELETE_POST = 'DELETE_POST';

export function createNewTable(newTable) {
  // category is default for now
  const URL = `${ROOT_URL}/board/create/table`;
  const request = axios({
    method: 'post',
    url: URL,
    data: {
      title: newTable.title,
      description: newTable.description,
      hashtags: newTable.hashtags,
      private: newTable.isPrivate,
      creator: newTable.creator,
      category:'Default'
    }
  });
  return {
    type: CREATE_NEW_TABLE,
    payload: request
  };
}

export function getTable(id){
  const URL = `${ROOT_URL}/table/${id}`;
  const request = axios.get(URL);
  return {
    type: GET_TABLE,
    payload: request
  }
}

export function newPost(content, ID){
  const URL = `${ROOT_URL}/table/${ID}/createpost`
  const request = axios({
    method: 'post',
    url: URL,
    data: {
      content: content.body,
      author: content.author,
      color: content.color
    }
  });

  return {
    type: NEW_POST,
    payload:request
  }
}

export function listPosts(ID){
  const request = axios.get(`${ROOT_URL}/table/${ID}/list`);

  return {
    type: LIST_POSTS,
    payload:request
  }
}

export function joinTable(ID, username){
  const URL = `${ROOT_URL}/table/${ID}/join`
  const request = axios({
    method: 'put',
    url: URL,
    data: {
      username: username
    }
  });

  return {
    type: JOIN_TABLE,
    payload: request
  }
}

export function deletePost(tableId, postId){
  const URL = `${ROOT_URL}/table/${tabldId}/posts/${postId}/delete`
  const request = axios({
    method: 'delete',
    url: URL
  });

  return {
    type: DELETE_POST,
    payload: request
  }
}
