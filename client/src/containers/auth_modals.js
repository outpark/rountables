import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Modal, Popover, Tooltip, OverlayTrigger } from 'react-bootstrap';

export default class AuthModals extends Component {

  constructor(props){
    super(props)
    this.state = {
      showSignUpModal: false,
      showLogInModal: false
     }

    this.signUpClose = this.signUpClose.bind(this);
    this.signUpOpen = this.signUpOpen.bind(this);
    this.logInClose = this.logInClose.bind(this);
    this.logInOpen = this.logInOpen.bind(this);
  }

  signUpClose() {
    this.setState({ showSignUpModal: false });
  }

  signUpOpen() {
    this.setState({ showSignUpModal: true });
  }

  logInClose() {
    this.setState({ showLogInModal: false });
  }

  logInOpen() {
    this.setState({ showLogInModal: true });
  }

  render() {
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
        <div className="btn-cotainer col-xs-4 col-md-8">

          <Button
            bsStyle="primary"
            bsSize="sm"
            onClick={this.signUpOpen}
            className="pull-right"
          >
            Sign Up
          </Button>
          <Button
            bsStyle="primary"
            bsSize="sm"
            onClick={this.logInOpen}
            className="pull-right"
          >
            Log In
          </Button>

        </div>

        <Modal show={this.state.showSignUpModal} onHide={this.signUpClose} >
          <Modal.Header closeButton>
            <Modal.Title>Sign Up Form</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <h4>Please Enter Following <OverlayTrigger overlay={popover}><a href="#">Credentials</a></OverlayTrigger></h4>
            <div className="input-group">
              <span className="input-group-addon" id="basic-addon1">@</span>
              <input type="text" className="form-control" placeholder="Username" aria-describedby="basic-addon1" />
            </div>
            <div className="input-group">
              <span className="input-group-addon" id="basic-addon1">@</span>
              <input type="password" className="form-control" placeholder="Password" aria-describedby="basic-addon1" />
            </div>
            <div className="input-group">
              <span className="input-group-addon" id="basic-addon1">@</span>
              <input type="password" className="form-control" placeholder="Confirm" aria-describedby="basic-addon1" />
            </div>
            <div className="input-group">
              <span className="input-group-addon" id="basic-addon1">@</span>
              <input type="text" className="form-control" placeholder="Email" aria-describedby="basic-addon1" />
            </div>


            <p>there is a <OverlayTrigger overlay={tooltip}><a href="#">tooltip</a></OverlayTrigger> here</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.signUpClos}>Submit</Button>
            <Button onClick={this.signUpClose}>Close</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.showLogInModal} onHide={this.logInClose}>
          <Modal.Header closeButton>
            <Modal.Title>Log In Form</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Text in a modal</h4>
            <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>

            <h4>Popover in a modal</h4>
            <p>there is a <OverlayTrigger overlay={popover}><a href="#">popover</a></OverlayTrigger> here</p>

            <h4>Tooltips in a modal</h4>
            <p>there is a <OverlayTrigger overlay={tooltip}><a href="#">tooltip</a></OverlayTrigger> here</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.logInClose}>Submit</Button>
            <Button onClick={this.logInClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
};

//sessionStorage.setItem('myCat', 'Tom');
// function mapStateToProps(state){
//   return { posts: state}
// }
//
// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({ }, dispatch);
// }
//
//
// export default connect(mapStateToProps, mapDispatchToProps)(AuthModals);
