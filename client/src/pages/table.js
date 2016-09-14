import React, { Component } from 'react';
import AuthModals from '../containers/auth_modals';
import TableCreate from '../containers/table_create';
import Logo from '../components/logo';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { TableTabs } from '../components/table_tabs';
import TableHeader from '../containers/table_header';
export default class Table extends Component {
  // componentDidMount(){
  //   NotificationManager.info('Your Table page.');
  // }
  render() {
    return (
      <div>
        <div className="table-page-header">
          <Logo />
          <TableCreate />
          <AuthModals />
          <TableHeader {...this.props} />
        </div>
      </div>
    );
  }
}
