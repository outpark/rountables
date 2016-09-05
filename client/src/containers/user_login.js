import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import { userLogIn } from '../actions/auth';
import { Button, Modal, Popover, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { meFromTokenSuccess, meFromTokenFailure } from '../actions/auth';

class UserLogIn extends Component {

  constructor(props){
    super(props)
    this.state = {
      showLogInModal: false
     }
    this.logInClose = this.logInClose.bind(this);
    this.logInOpen = this.logInOpen.bind(this);
  }

  logInClose() {
    this.setState({ showLogInModal: false });
  }

  logInOpen() {
    this.setState({ showLogInModal: true });
  }

  onSubmit(props) {

   this.props.userLogIn(props)
    .then((response) => {
      // handle jwt store here
      if(response.payload.data.success === true){
        this.logInClose();
        sessionStorage.setItem('jwtToken', response.payload.data.token);
        this.props.meFromTokenSuccess(response.payload.data);
        NotificationManager.success(`Welcome Back, ${response.payload.data.username}`, 'Log In Successful');
      }else{
        NotificationManager.warning(`Error Occurred!, ${response.payload.data.message}`, `Log In Unsuccessful`);
        this.props.meFromTokenFailure(response.payload.data);
      }
     });
   }

  render() {

    const { fields: {email, password}, handleSubmit } = this.props;

    const popover = (
      <Popover id="modal-popover" title="Info">
        Username and Email must be unique.
      </Popover>
    );
    const tooltip = (
      <Tooltip id="modal-tooltip">
        wow.
      </Tooltip>
    );

    return (
      <div>
        <div className="btn-cotainer">
          <Button
            bsStyle="primary"
            bsSize="sm"
            onClick={this.logInOpen}
            className="pull-right"
          >
            Log In
          </Button>
        </div>

        <Modal show={this.state.showLogInModal} onHide={this.logInClose} >
          <Modal.Header closeButton>
            <Modal.Title>Log In Form</Modal.Title>
          </Modal.Header>
          <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <Modal.Body>
              <h4>Please Enter Following <OverlayTrigger overlay={popover}><a href="#">Credentials</a></OverlayTrigger></h4>

              <div className={`form-group ${email.touched && email.invalid ? 'has-error' : ''}`}>
                <input type="text" className="form-control" placeholder="Email" aria-describedby="basic-addon1" {...email}/>
                <div className="help-block">
                  {email.touched ? email.error : ''}
                </div>
              </div>
              <div className={`form-group ${password.touched && password.invalid ? 'has-error' : ''}`}>
                <input type="password" className="form-control" placeholder="Password" aria-describedby="basic-addon1" {...password}/>
                <div className="help-block">
                  {password.touched ? password.error : ''}
                </div>
              </div>

            <p>there is a <OverlayTrigger overlay={tooltip}><a href="#">tooltip</a></OverlayTrigger> here</p>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <Button onClick={this.logInClose}>Close</Button>
          </Modal.Footer>
          </form>
        </Modal>
      </div>
    );
  }
};

function validate(values){
  const errors = {};
  if(!values.email){
    errors.email = 'Enter a category';
  }
  if(!values.password){
    errors.password = 'Enter some content';
  }
  if(values.password){
    if(values.password.length < 5){
      errors.password = 'Password must be longer than 4 letters'
    }
  }
  return errors;
}

export default reduxForm({
  form: 'UserLogIn',
  fields: ['email', 'password'],
  validate
}, null, { userLogIn, meFromTokenSuccess, meFromTokenFailure  })(UserLogIn);
