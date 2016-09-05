import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import { userSignUp } from '../actions/auth'
import { Button, Modal, Popover, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { meFromToken, meFromTokenSuccess, meFromTokenFailure, resetToken } from '../actions/auth';
// Change meFromTokenSuccess to userSignUpSuccess
class UserSignUp extends Component {

  constructor(props){
    super(props)
    this.state = {
      showSignUpModal: false
     }

    this.signUpClose = this.signUpClose.bind(this);
    this.signUpOpen = this.signUpOpen.bind(this);

  }

  signUpClose() {
    this.setState({ showSignUpModal: false });
  }

  signUpOpen() {
    this.setState({ showSignUpModal: true });
  }

  onSubmit(props) {

   this.props.userSignUp(props)
    .then((response) => {
      // handle jwt store here
      if(response.payload.data.success === true){
        this.signUpClose;
        sessionStorage.setItem('jwtToken', response.payload.data.token);
        this.props.meFromTokenSuccess(response.payload.data);
        NotificationManager.success(`Welcome!, ${response.payload.data.username}`, 'Sign Up Successful');
      }else{
        NotificationManager.warning(`Error Occurred! ${response.payload.data.message}`, `Sign Up Unsuccessful`);
        this.props.meFromTokenFailure(response.payload.data);
      }
     });
   }

  render() {

    const { fields: {username, email, password, confirm }, handleSubmit } = this.props;

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
            onClick={this.signUpOpen}
            className="pull-right"
          >
            Sign Up
          </Button>
        </div>

        <Modal show={this.state.showSignUpModal} onHide={this.signUpClose} >
          <Modal.Header closeButton>
            <Modal.Title>Sign Up Form</Modal.Title>
          </Modal.Header>
          <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <Modal.Body>

              <h4>Please Enter Following <OverlayTrigger overlay={popover}><a href="#">Credentials</a></OverlayTrigger></h4>
              <div className={`form-group ${username.touched && username.invalid ? 'has-error' : ''}`}>
                <input type="text" className="form-control" placeholder="Username" aria-describedby="basic-addon1" {...username} />
                <div className="help-block">
                  {username.touched ? username.error : ''}
                </div>
              </div>
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
              <div className={`form-group ${confirm.touched && confirm.invalid ? 'has-error' : ''}`}>
                <input type="password" className="form-control" placeholder="Confirm" aria-describedby="basic-addon1" {...confirm}/>
                <div className="help-block">
                  {confirm.touched ? confirm.error : ''}
                </div>
              </div>

            <p>there is a <OverlayTrigger overlay={tooltip}><a href="#">tooltip</a></OverlayTrigger> here</p>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <Button onClick={this.signUpClose}>Close</Button>
          </Modal.Footer>
          </form>
        </Modal>
      </div>
    );
  }
};

function validate(values){
  const errors = {};
  if(!values.username){
    errors.username = 'Enter a username';
  }
  if(!values.email){
    errors.email = 'Enter a category';
  }
  if(!values.password){
    errors.password = 'Enter some content';
  }
  if(!values.confirm){
    errors.confirm = 'Enter some content';
  }
  if(values.password !== values.confirm){
    errors.confirm = 'Password has to match.'
  }
  if(values.password){
    if(values.password.length < 5){
      errors.password = 'Password must be longer than 4 letters'
    }
  }
  if(/\s/.test(values.username)){
    errors.username = "Please, remove whitespace."
  }
  return errors;
}

export default reduxForm({
  form: 'UserSignUp',
  fields: ['username', 'email', 'password', 'confirm'],
  validate
}, null, { userSignUp, meFromTokenSuccess, meFromTokenFailure })(UserSignUp);
