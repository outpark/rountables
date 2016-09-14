import React, { Component, PropTypes } from 'react';
import ReactDOM, {findDOMNode} from 'react-dom';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { newPost, listPosts } from '../actions/table';
import { meFromTokenSuccess } from '../actions/auth';
import { Button, Panel, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { NotificationContainer, NotificationManager } from 'react-notifications';

class TableBoard extends Component {
  constructor(props){
    super(props);
    this.state = {
      body:"",
      author:"",
      table_id:"",
      color:"grey",
      isAdmin: false,
      isMember:false,
      user:{},
      table:{},
      posts:[]
    }

    this.onContentChange = this.onContentChange.bind(this);
  }

  componentWillMount(){
    if(!this.state.table.title){
      this.setState({
        table:this.props.table,
        isAdmin:this.props.isAdmin,
        isMember:this.props.isMember
      });
      this.props.listPosts(this.props.table._id);
    }
  }

  componentWillUpdate(){
    if(this.props.user && !this.state.user.username){
      this.setState({user:this.props.user})
    }
  }

  onContentChange(event){
    this.setState({
      body:event.target.value
    });
  }

  onColorsChange(event){
    this.setState({
      color:event.target.value
    });
  }

  deletePost(postId){
    
  }

  onSubmitPost(event){
    event.preventDefault();
    if(!this.state.user.username){
      NotificationManager.warning(`You have to log in first.`, `Login Required`);
      return;
    }
    let colors = this.state.color;
    let body = this.state.body;

    const post = {
      color: this.state.color,
      body: this.state.body,
      author: this.state.user.username
    }
    this.props.newPost(post, this.state.table._id).then((response)=>{
      if(response.payload.data.success === true){
        NotificationManager.success(`A new post has been created.`, `Creation Successful`);
        this.props.listPosts(this.props._id);
        this.setState({
          posts:response.payload.data.post
        });
      }else{
        NotificationManager.warning(`${response.payload.data.message}`, `Problem Occured`);
      }
    });
  }

  renderInput(){
    return(
      <div className="col-md-12 col-lg-12 col-xs-12">
        <div className="new-post-input">
          <form onSubmit={this.onSubmitPost.bind(this)}>
              <textarea className="form-control" rows="4" onChange={this.onContentChange}/>
              <ControlLabel>Color</ControlLabel>
              <FormControl componentClass="select" refs="colorBox" placeholder="select" onChange={this.onColorsChange.bind(this)}>
                <option value="grey">Grey</option>
                <option value="orange">Orange</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="red">Red</option>
              </FormControl>
            <Button type="submit" bsSize="xsmall" className="pull-right">
              Submit
            </Button>
          </form>
        </div>
      </div>
    );
  }
  renderPost(post){
    let color = post.color;
    switch(color) {
      case "grey":
        color = "default";
        break;
      case "blue":
        color = "info";
        break;
      case "green":
        color = "success";
        break;
      case "red":
        color = "danger";
        break;
      case "orange":
        color = "warning";
        break;
      default:
        color = "default";
        break;
    }
    let title = `${post.author} at ${post.created_at}`
    if(color === 'default'){

      return(
        <div key={post._id} className="col-md-6 col-xs-12 col-lg-6">
        <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
        <Panel header={title}>
          {post.content}
        </Panel>
        </ div>
      );
    }else{
      return(
        <div key={post._id} className="col-md-6 col-xs-12 col-lg-6">
          <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
          <Panel header={title} bsStyle={color}>
            {post.content}
          </Panel>
        </div>
      );
    }
  }
  render(){
    if(this.props.posts === undefined || this.props.posts.length === 0){
      return(
        <div>
          <Panel header="No posts yet...">
            Write your first post now!
          </Panel>
          {this.renderInput()}
        </div>
      );
    }else{
      // if(this.state.posts && this.state.posts.length > 1){
      //   return(
      //     <div className="col-md-12 col-xs-12 col-lg-12">
      //       {this.state.posts.map(this.renderPost)}
      //       {this.renderInput()}
      //     </div>
      //   );
      // }
      return(
        <div>
          {this.props.posts.map(this.renderPost)}
            {this.renderInput()}
        </div>
      );
    }

  }


}

//TODO: implement this
function isMember(){

}

function isAdmin(){

}

function mapStateToProps(state){
  return {
      user: state.userData.user,
      posts: state.postList.posts
   };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ meFromTokenSuccess, listPosts, newPost }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TableBoard);
