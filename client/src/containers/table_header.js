import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getTable, joinTable } from '../actions/table';
import { meFromTokenSuccess } from '../actions/auth';
import { Button, Panel } from 'react-bootstrap';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import TableMembers from './table_members';
import TableBoard from './table_board';
import TableChat from './table_chat';

class TableHeader extends Component {
  constructor(props){
    super(props);
    this.state ={
      tableData: {},
      title:"",
      memberClick:false,
      chatClick:false,
      boardClick:false,
      defaultClick:true,
      isPrivate: false,
      isAdmin: false,
      isMember:false
    }
  }

  componentWillMount(){
    if(this.props.location){
      let tablename = this.props.location.pathname.substring(7);
      this.props.getTable(tablename)
      .then((response) => {
        if(response.payload.data.success === true && $.isEmptyObject(this.state.Table) === true){

          this.setState({
            tableData: response.payload.data.table,
            isPrivate: response.payload.data.table.private
          });


        }else if(response.payload.data.success === false){
          NotificationManager.warning(`Table does not exist.`, `${tablename}`);
          this.setState({
            tableData:{}
          });
        }

      });
    }
  }
  componentWillUpdate(){
    let ifAdmin = this.state.isAdmin;
    if(this.props.currentUser && this.state.tableData.title){
      let user = this.props.currentUser;
      let table = this.state.tableData;
      if(isMember(table.admins, user.username) === true){
        ifAdmin = true;
      };
    }
    if(ifAdmin && this.state.isAdmin === false){
      this.setState({
        isAdmin: true
      });
    }
  }
  clickDefault(){
    this.setState({
      memberClick:false,
      chatClick:false,
      boardClick:false,
      defaultClick:true
    });
  }
  openMembers(){
    this.setState({
      memberClick:true,
      boardClick:false,
      chatClick:false,
      defaultClick:false
    });

  }
  openBoard(){
    this.setState({
      boardClick:true,
      memberClick:false,
      chatClick:false,
      defaultClick:false
    });

  }
  openChat(){
    this.setState({
      chatClick:true,
      memberClick:false,
      boardClick:false,
      defaultClick:false
    });

  }
  joinTable(){
    let user = this.props.currentUser;
    let table = this.state.tableData;
    if(!user){
      NotificationManager.warning(`You have to log in first`, `Login Rquired`);
      return;
    }
    if(!table._id){
      console.warn("NO TABLE DATA");
      return;
    }
    console.log("JOIN!"+table._id+user.username);
    this.props.joinTable(table._id, user.username).then((response)=>{
      if(response.payload.data.success === true){
        let table = response.payload.data.table;
        NotificationManager.success(`Welcome to ${table.title}`, `Join Requested`);
        this.setState({
          tableData:table,
          title:table.title
        })
      }else{
        NotificationManager.warning(`${response.payload.data.message}`, `Error Occured`);
      }
    });
  }
  renderParts(table){
    if(this.state.defaultClick === true){
      return(
        <div className="table-page-body col-md-12 col-xs-12 col-lg-12">
          <Panel header={`Welcome to ${table.title}!!`} className="table-page-body-main">
            {table.description}
          </Panel>
        </div>
      );
    }else{
      let props = {
        table: table,
        isAdmin: this.state.isAdmin,
        isMember: this.state.isMember
      }
      if(this.state.memberClick === true)
        return(
          <div className="table-page-body col-md-12 col-xs-12 col-lg-12">
            <TableMembers {...props}/>
          </div>
        );
      if(this.state.boardClick === true){
        return(
          <div className="table-page-body col-md-12 col-xs-12 col-lg-12">
            <TableBoard {...props}/>
          </div>
        );
      }
      if(this.state.chatClick === true){
        return(
          <div className="table-page-body col-md-12 col-xs-12 col-lg-12">
            <TableChat {...props}/>
          </div>
        );
      }
    }

  }

  renderJoin(){
    let ifMember = this.state.isMember;

    if(this.props.currentUser && this.state.tableData.title){
      let user = this.props.currentUser;
      let table = this.state.tableData;
      if(isMember(table.member_list, user.username) === true){
        ifMember = true;
      };
    }
    if(!ifMember){
      return(
          <Button bsStyle="primary" className="pull-right" onClick={this.joinTable.bind(this)}>
            Join
          </Button>
      );
    }else{
      return(<br></br>);
    }

  }
  render(){

    if($.isEmptyObject(this.state.tableData) === true){
      return(<div className="col-md-12">Loading...</div>);
    }
    let table = this.state.tableData;
    let isMemberClicked = this.state.memberClick;
    let isBoardClicked = this.state.boardClick;
    let isChatClicked = this.state.chatClick;
    let isPrivate = this.state.isPrivate;
    let user = this.props.currentUser;
    // console.log(this.state.isAdmin);
    return(
      <div>
        <div className="table-page-title col-md-12 col-xs-12 col-lg-12">
          <h3 onClick={this.clickDefault.bind(this)}>{table.title}</h3>
          <div className="hashtags"> {table.hashtags.map((tag)=>{
            return <Link to={`/show/?hashtag=${tag}`} key={tag}>#{tag} </Link>
          })}</div>
        </div>
        <div className="col-md-12 col-xs-12 col-lg-12">
          {this.renderJoin()}
        </div>
        <div className="table-page-buttons col-md-12 col-xs-12 col-lg-12">
          <Button className="table-nav-button" onClick={this.openMembers.bind(this)} active={isMemberClicked} disabled={isPrivate}>
            Members
          </Button>
          <Button className="table-nav-button" onClick={this.openBoard.bind(this)} active={isBoardClicked} disabled={isPrivate}>
            Board
          </Button>
          <Button className="table-nav-button" onClick={this.openChat.bind(this)} active={isChatClicked} disabled={isPrivate}>
            Chat
          </Button>
        </div>
        {this.renderParts(table)}
      </div>

    );
  }
}

function isMember(memberList, user){
  let checker = false;
  memberList.forEach(function(member){
    if(member.username === user){
      checker = true;
    }
  });
  return checker;
}

function mapStateToProps(state){
  return {
      currentUser: state.userData.user,
      tableData: state.tableData
   };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getTable, meFromTokenSuccess, joinTable }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TableHeader);
