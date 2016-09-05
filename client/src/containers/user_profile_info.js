import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getUser, updateUser } from '../actions/user';
import { meFromTokenSuccess } from '../actions/auth';
import { Button, Modal, Popover, Tooltip, OverlayTrigger, Fade, Well } from 'react-bootstrap';
import { NotificationContainer, NotificationManager } from 'react-notifications';


class UserProfileAndInfo extends Component {
  constructor(props){
    super(props)
    this.state = {
        profileData: {},
        username:"",
        me:{},
        intro:"",
        edu:"",
        work:""
    }
    this.onIntroChange = this.onIntroChange.bind(this);
    this.onWorkChange = this.onWorkChange.bind(this);
    this.onEduChange = this.onEduChange.bind(this);
    this.handleUserUpdate = this.handleUserUpdate.bind(this);
  }

  componentWillMount(){
    if(this.props.userData){
      this.props.getUser(this.props.userData.username);
    }
    else if(this.state.profileData.username){
      console.log(this.state.profileData.username);
    }
    else if(this.props.location){
      this.setState({username:this.props.location.pathname.substring(6)});
      this.props.getUser(this.props.location.pathname.substring(6));
    }
  }

  componentWillUpdate(){
    if(this.props.me !== null && $.isEmptyObject(this.state.me) === true){
      this.setState({me: this.props.me});
    }
    if($.isEmptyObject(this.props.profileData) === false && $.isEmptyObject(this.state.user) === true){
      this.setState({user:this.props.profileData.user});
    }
  }

  onIntroChange(event){
    this.setState({intro:event.target.value});
  }
  onWorkChange(event){
    this.setState({work:event.target.value});
  }
  onEduChange(event){
    this.setState({edu:event.target.value});
  }

  onSubmitIntro(event){
    console.log(event);
    event.preventDefault();

    const requestInput = {
      which: "introduction",
      toWhat: this.state.intro
    }
    this.handleUserUpdate(requestInput);
    this.setState({ introOpen: !this.state.introOpen });
  }

  onSubmitWork(event){
    console.log(event);
    event.preventDefault();

    const requestInput = {
      which: "work",
      toWhat: this.state.work
    }
    this.handleUserUpdate(requestInput);
    this.setState({ workOpen: !this.state.workOpen });
  }
  onSubmitEdu(event){
    console.log(event);
    event.preventDefault();

    const requestInput = {
      which: "education",
      toWhat: this.state.edu
    }
    this.handleUserUpdate(requestInput);
    this.setState({ eduOpen: !this.state.eduOpen });
  }

  handleUserUpdate(request){
    this.props.updateUser(request, this.state.username)
    .then((response) => {
      if(response.payload.data.success === false){
        NotificationManager.warning(`${response.payload.data.message}`, `Not Updated`);
      }else{
        this.setState({user: response.payload.data.user});
      }
    });
  }

  renderProfile(curUser){
    if(!curUser){
      console.log("NO DATA!");
    }
    let introduction, education, work;
    let isMe = false;
    if(curUser.username === this.state.me.username){
      introduction = hasIntroduction(curUser);
      education = hasEducation(curUser);
      work = hasWork(curUser);
      isMe = true;
    }else {
      introduction = curUser.introduction;
      education = curUser.education;
      work = curUser.work;
    }

    return(
      <div>
        <div className="user-description pull-left col-md-6 col-xs-6">
          {introduction}
          <Button bsStyle="link" onClick={()=> this.setState({ introOpen: !this.state.introOpen })}>
            {isMe ? "Update": ''}
          </Button>
          <Fade in={this.state.introOpen}>
            <div>
              <Well>
                <form onSubmit={this.onSubmitIntro.bind(this)}>
                  <textarea className="form-control" rows="4" onChange={this.onIntroChange}/>
                  <Button type="submit" bsSize="xsmall" className="pull-right">
                    Submit
                  </Button>
                </form>
              </Well>
            </div>
          </Fade>
        </div>
        <div className="user-work col-md-6 col-xs-6">
          Work
          <hr/>
          <ul className="col-md-4">{work.map((title)=>{
            return <li key={title}>{title}</li>
          })}</ul>
          <Button bsStyle="link" className="col-md-2 pull-right" onClick={()=> this.setState({ workOpen: !this.state.workOpen })}>
            {isMe ? "Update": ''}
          </Button>
          <Fade in={this.state.workOpen} className="col-md-12">
            <div>
                <form onSubmit={this.onSubmitWork.bind(this)}>
                  <input className="form-control" placeholder="Hit enter to submit." onChange={this.onWorkChange}/>
                </form>
            </div>
          </Fade>
        </div>
        <div className="user-edu col-md-6 col-xs-6">
          Education
          <hr/>
          <ul className="col-md-4">{education.map((title)=>{
            return <li key={title}>{title}</li>
          })}</ul>
          <Button bsStyle="link" className="col-md-2 pull-right" onClick={()=> this.setState({ eduOpen: !this.state.eduOpen })}>
            {isMe ? "Update": ''}
          </Button>
          <Fade in={this.state.eduOpen} className="col-md-12">
            <div>
                <form onSubmit={this.onSubmitEdu.bind(this)}>
                  <input className="form-control" placeholder="Hit enter to submit." onChange={this.onEduChange}/>
                </form>
            </div>
          </Fade>
        </div>
      </div>
    );
  }

  render() {
    if($.isEmptyObject(this.props.profileData) === true){
      return(<div>Loading...</div>);
    }
    if(this.props.profileData.success === false){
      NotificationManager.warning(`This is not a real user.`, `User does not exist`);
      return(
        <div>
          <img src="/img/ghost.png"/>
        </div>
      );
    }else{
      let curUser = this.state.user;
      let image = hasImage(curUser);
      return (
        <div>
          <div className="user-header">
            <div className="user-main-info">
              <img className="img-circle" src={image}/>
              <div className="user-main-info-text">{curUser.username}</div>
            </div>
            <div className="user-main-buttons-group">
              <Button
                bsStyle="primary"
                className="profile-button-left"
              >
                Profile
              </Button>
              <Button
                bsStyle="primary"
                className="profile-button-right"
              >
                Info
              </Button>
            </div>
          </div>
          <div className="user-body">
            {this.renderProfile(curUser)}
          </div>
        </div>
      );
    }


  }
}

function hasIntroduction(user) {
  if(!user.introduction){
    return "You don't have your introduction yet."
  }else{
    return user.introduction
  }
}

function hasEducation(user){
  if(user.education.length === 0){
    return ["You haven't added your edcation yet."]
  }else{
    return user.education
  }
}

function hasWork(user){
  if(user.work.length === 0){
    return ["You haven't added your work yet."]
  }else{
    return user.work
  }
}

function hasImage(user){
  if(!user.profile_url){
    return "/img/kitten.jpg"
  }else{
    return user.profile_url
  }
}

function mapStateToProps(state){
  return {
      profileData: state.profileData.info,
      me:state.userData.user
   };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getUser, meFromTokenSuccess, updateUser }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileAndInfo);
