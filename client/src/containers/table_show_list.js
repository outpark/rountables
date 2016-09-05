import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { listTables } from '../actions/list_tables';
import { fetchTables, fetchDetailTables } from '../actions/search';
import { Button, Modal, OverlayTrigger } from 'react-bootstrap';
import { Link } from 'react-router';

// import GoogleMap from '../components/google_map';

class TableShowList extends Component {
  constructor(props){
    super(props);
    this.state = {
      tables: []
    }
    this.clickHashtag = this.clickHashtag.bind(this);
    this.renderTable = this.renderTable.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount(){
    if(this.props.location.query){
      let tags = [];
      if(this.props.location.query.hashtag && !this.props.location.query.title){
        tags = this.props.location.query.hashtag.split(/[ ,]+/);
        this.props.fetchTables(tags);
      }else if(this.props.location.query.hashtag && this.props.location.query.title){
        tags = hashtagValidate(this.props.location.query.hashtag);
        this.props.fetchDetailTables(tags, this.props.location.query.title)
      }
    }else{
      this.props.listTables();
    }
  }

  clickHashtag(tag){
    let tagToArray = tag.split(/[ ,]+/);
    this.props.fetchTables(tagToArray);
  }

  handleClick(event) {
    $(".input-hashtag").val(event.target.parentNode.name);
    let hashtag = event.target.parentNode.name.split(/[ ,]+/);
    this.props.fetchTables(hashtag);
  }

  renderTable(tableData){
    if(!tableData){
      console.log("No table data.");
    }
    const ID = tableData._id;
    const title = tableData.title;
    const hashtags = tableData.hashtags;
    const myThis = this;
    return(
      <li className="col-md-3 table-show" key={ID}>
      <Link to={`/table/${ID}`}>{title}</Link>
      <div className="hashtags">
      {hashtags.map(function(tag){
        return <Link onClick={myThis.handleClick} name={tag} key={tag} to={`/show/?hashtag=${tag}`}>#{tag} </Link>
      })} </div>
      </li>
    );
  }

  render() {
    let curTitle = "";
    if(this.props.tables === undefined){
      return(
        <div className='col-md-12'>...loading</div>
      );
    }else{
      if(this.props.location.query.title){
        curTitle = this.props.location.query.title;
      }
    }
    return (
      <div>
        <div className="col-md-12">
          #{this.props.location.query.hashtag} {curTitle}
        </div>
        <ul className="col-md-10 col-lg-10">
        {this.props.tables.map(this.renderTable)}
        </ul>
      </div>

    );
  }
}
function hashtagValidate(tagsToCheck){
  if(typeof tagsToCheck === 'string'){
    return tagsToCheck.split(/[ ,]+/);
  }else{
    return tagsToCheck;
  }
}
function mapStateToProps(state){
  return { tables: state.tableList.tables };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ listTables, fetchTables, fetchDetailTables }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TableShowList);
