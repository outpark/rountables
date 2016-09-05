import React, { Component, PropTypes } from 'react';
import UserSignUp from './user_signup';
import UserLogIn from './user_login';
import UserLogOut from './user_logout';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import { meFromTokenSuccess, meFromTokenFailure, resetToken} from '../actions/auth';
import { NotificationContainer, NotificationManager } from 'react-notifications';

class AuthModals extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  constructor(props){
    super(props)
    this.state = {
        userData: {}
     }
    this.userLogOut = this.userLogOut.bind(this);
    this.userDirectToProfile = this.userDirectToProfile.bind(this);

  }
  userLogOut() {
    sessionStorage.removeItem('jwtToken'); //remove token from storage
    NotificationManager.success(`Goodbye.`, 'Log Out Successful');
    this.props.resetToken();
    this.context.router.push({
      pathname: '/'
    });
  }
  userDirectToProfile() {
    this.context.router.push({ //browserHistory.push should also work here
     pathname: `/user/${this.props.userData.username}`
   });
  }
  render() {
    if(this.props.userData){
      return (
        <div className="pull-right">
          <div className="col-md-8 col-xs-4">
            <DropdownButton title={this.props.userData.username} id="bg-nested-dropdown">
              <MenuItem eventKey="1" onClick={this.userDirectToProfile}>Profile</MenuItem>
              <MenuItem eventKey="2" onClick={this.userLogOut}>Log Out</MenuItem>
            </DropdownButton>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="col-md-8 col-xs-4 pull-right">
          <UserSignUp />
          <UserLogIn />
        </div>
      </div>
    );
  }

}

function mapStateToProps(state){
  return { userData: state.userData.user };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ meFromTokenSuccess, resetToken }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthModals);
