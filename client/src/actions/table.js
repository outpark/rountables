import axios from 'axios';

const ROOT_URL = `http://localhost:5000/api`
export const CREATE_NEW_TABLE = 'CREATE_NEW_TABLE';


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
