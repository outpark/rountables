import React, { Component } from 'react';
import AuthModals from '../containers/auth_modals';
import TableCreate from '../containers/table_create';
import Logo from '../components/logo';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { TableTabs } from '../components/table_tabs'

export default class Table extends Component {
  // componentDidMount(){
  //   NotificationManager.info('Your Table page.');
  // }
  render() {
    return (
      <div>
        <Logo />
        <TableCreate />
        <AuthModals />
        <p>table page</p>
      </div>
    );
  }
}
