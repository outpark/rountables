import React, { Component, PropTypes } from 'react';
import UserSignUp from './user_signup';
import UserLogIn from './user_login';
import UserLogOut from './user_logout';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { meFromTokenSuccess, meFromTokenFailure, resetToken} from '../actions/auth';



class AuthModals extends Component {
  constructor(props){
    super(props)
    this.state = {
        userData: ""
     }
  }

  render() {
    if(this.props.userData.user){
      return (
        <div>
          <div className="col-md-8 col-xs-4">
            <span>{this.props.userData.user.username}</span>
            <UserLogOut />
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="col-md-8 col-xs-4">
          <UserSignUp />
          <UserLogIn />
        </div>
      </div>
    );
  }

}
function mapStateToProps(state){
  return { userData: state.user };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ meFromTokenSuccess, resetToken }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthModals);
