import React, { Component } from 'react';
import SearchBar from '../containers/search_bar';
import TableList from '../containers/table_list';
import AuthModals from '../containers/auth_modals';
import TableCreate from '../containers/table_create';
import Logo from './logo';

export default class Home extends Component {
  render() {
    return (
      <div>
        <Logo />
        <TableCreate />
        <AuthModals />
        <SearchBar />
        <TableList />
      </div>
    );
  }
}
