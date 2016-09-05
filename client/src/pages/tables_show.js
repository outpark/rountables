import React, { Component } from 'react';
import SearchBar from '../containers/search_bar';
import TableShowList from '../containers/table_show_list';
import AuthModals from '../containers/auth_modals';
import TableCreate from '../containers/table_create';
import Logo from '../components/logo';

export default class Show extends Component {
  render() {
    return (
      <div>
        <Logo />
        <TableCreate />
        <AuthModals />
        <SearchBar {...this.props} />
        <TableShowList {...this.props} />
      </div>
    );
  }
}
