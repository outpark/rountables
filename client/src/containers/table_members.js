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

  renderLeaders(leader){

    return(
      <div key={leader._id} className="table-member-each">
      <Media>
       <Media.Left className="round-border">
          <img width={128} height={128} src="/img/kitten.jpg" alt="Image"/>
        </Media.Left>
        <Media.Body>
          <Media.Heading>{leader.username}</Media.Heading>
          <p>{leader.description}</p>
        </Media.Body>
      </Media>
      </div>
    );
  }
  renderMembers(member){
    return(
      <div key={member._id} className="table-member-each">
      <Media>
       <Media.Left className="round-border">
          <img width={128} height={128} src="/img/kitten.jpg" alt="Image"/>
        </Media.Left>
        <Media.Body>
          <Media.Heading>{member.username}</Media.Heading>
          <p>{member.description}</p>
        </Media.Body>
      </Media>
      </div>
    );
  }
  render(){
    let members = this.state.table.member_list;
    let leaders = this.state.table.admins;
    let creator = this.state.table.creator;
    return(
      <div>
        <div className="table-leader-list">
          <h4>Leaders</h4>
          {leaders.map(this.renderLeaders)}
        </div>
        <div className="table-member-list">
          <h4>Members</h4>
          {members.map(this.renderMembers)}
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
