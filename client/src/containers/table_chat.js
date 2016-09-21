import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getTable } from '../actions/table';
import { meFromTokenSuccess } from '../actions/auth';
import { Button, Media } from 'react-bootstrap';
import { NotificationContainer, NotificationManager } from 'react-notifications';

class TableMembers extends Component {
  constructor(props){
    super(props);
    this.state = {
      table:{}
    }
  }

  componentWillMount(){
    if(!this.state.table.title)
      this.setState({table:this.props.table});
  }

  render(){
    return(
      <div>
        <div className="table-leader-list">
          <h4>This page is under construction!</h4>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state){
  return {
      user: state.userData.user
   };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ meFromTokenSuccess }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TableMembers);
