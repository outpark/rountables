import React, { Component } from 'react';
import SearchBar from '../containers/search_bar';
import TableList from '../containers/table_list';
import AuthModals from '../containers/auth_modals';
import TableCreate from '../containers/table_create';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Logo from '../components/logo';

export default class Home extends Component {
  componentDidMount(){
    NotificationManager.info('Welcome!');
  }
  render() {
    return (
      <div>
        <div className="head-container">
          <Logo />
          <TableCreate />
          <AuthModals />
          <div className="rountables">
            <h2> ROUNTABLES </h2>
          </div>
          <SearchBar />
        </div>
        <TableList />
      </div>
    );
  }
}
