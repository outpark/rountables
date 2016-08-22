import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
// import { userLogIn } from '../actions/auth';
import { Button, Modal, Popover, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { NotificationContainer, NotificationManager } from 'react-notifications';
// import { meFromTokenSuccess, meFromTokenFailure } from '../actions/auth';

export default class TableCreate extends Component {

  constructor(props){
    super(props)
    this.state = {
      showTableCreateModal: false
     }

    this.tableCreateClose = this.tableCreateClose.bind(this);
    this.tableCreateOpen = this.tableCreateOpen.bind(this);

  }

  tableCreateClose() {
    this.setState({ showTableCreateModal: false });
  }

  tableCreateOpen() {
    this.setState({ showTableCreateModal: true });
  }


  render() {
    const popover = (
      <Popover id="modal-popover" title="popover">
        very popover. such engagement
      </Popover>
    );
    const tooltip = (
      <Tooltip id="modal-tooltip">
        wow.
      </Tooltip>
    );

    return (
      <div>
        <div className="btn-cotainer col-xs-4 col-md-2">

          <Button
            bsStyle="primary"
            bsSize="sm"
            onClick={this.tableCreateOpen}
            className="pull-left"
          >
            Create Table
          </Button>
        </div>

        <Modal show={this.state.showTableCreateModal} onHide={this.tableCreateClose} >
          <Modal.Header closeButton>
            <Modal.Title>Create New Table</Modal.Title>
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
            <Button onClick={this.tableCreateClose}>Submit</Button>
            <Button onClick={this.tableCreateClose}>Close</Button>
          </Modal.Footer>
        </Modal>

      </div>
    );
  }
};

function ensureAuthorized() {
  // verify user session here
}

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
