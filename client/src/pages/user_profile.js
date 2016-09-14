import React, { Component, PropTypes } from 'react';
import AuthModals from '../containers/auth_modals';
import TableCreate from '../containers/table_create';
import UserProfileAndInfo from '../containers/user_profile_info';
import Logo from '../components/logo';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
export default class User extends Component {
  // componentWillMount(){
  //   NotificationManager.info('Your Table page.');
  // }
  render() {
    return (
      <div>
        <UserProfileAndInfo {...this.props} />
      </div>
    );
  }
}
