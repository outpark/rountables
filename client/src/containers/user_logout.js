import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import { userLogIn } from '../actions/auth';
import { Button, Modal, Popover, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { resetToken } from '../actions/auth';
import { NotificationContainer, NotificationManager } from 'react-notifications';

export default class UserLogOut extends Component {

  constructor(props){
    super(props)
    this.userLogOut = this.userLogOut.bind(this);
  }

  userLogOut() {
    sessionStorage.removeItem('jwtToken'); //remove token from storage
    NotificationManager.success(`Goodbye.`, 'Log Out Successful');
    this.props.resetToken();
  }

  render() {
    return (
      <div>
        <div className="btn-cotainer">
          <Button
            bsStyle="primary"
            bsSize="sm"
            onClick={this.userLogOut}
            className="pull-right"
          >
            Log Out
          </Button>
        </div>
      </div>
    );
  }
};


function mapDispatchToProps(dispatch) {
  return bindActionCreators({ resetToken }, dispatch);
}

export default connect(null, mapDispatchToProps)(UserLogOut);
