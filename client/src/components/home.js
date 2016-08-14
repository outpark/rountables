import React, { Component } from 'react';
import SearchBar from '../containers/search_bar';
import TableList from '../containers/table_list';

export default class Home extends Component {
  render() {
    return (
      <div>
        <SearchBar />
        <TableList />
      </div>
    );
  }
}
