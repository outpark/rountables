import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { listTables } from '../actions/list_tables';
import { fetchTables, fetchDetailTables } from '../actions/search';
import { Button, Modal, OverlayTrigger, Carousel } from 'react-bootstrap';
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

  renderSidebar(){

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

      <li className="col-md-6 col-xs-12 col-lg-4" key={ID}>
        <Carousel className="table-show round-border">
        <Carousel.Item>
          <img width={245} height={245} src="/img/nyc.jpg"/>
          <Carousel.Caption>
            <Link to={`/table/${ID}`} className="t-title-show">{title}</Link>
            <div className="hashtags-show">
            {hashtags.map(function(tag){
              return <Link to={`/show/?hashtag=${tag}`} key={tag} onClick={myThis.handleClick}>#{tag} </Link>
            })} </div>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img width={245} height={245} src="/img/nyc.jpg"/>
          <Carousel.Caption>
            <p>{tableData.description}</p>
          </Carousel.Caption>
        </Carousel.Item>
        </Carousel>

      </li>

    );
  }

  render() {
    let curTitle = "";
    if(this.props.tables === undefined || this.props.tables.length === undefined){
      return(
        <i className="fa fa-spinner fa-spin fa-3x fa-fw spinner-container col-md-12 col-xs-12" style={{fontSize:100}}></i>
      );
    }else{
      if(this.props.location.query.title){
        curTitle = this.props.location.query.title;
      }
    }
    let hashtags = hashtagValidate(this.props.location.query.hashtag);
    let thisHolder = this;
    //make tha hashtags links
    return (
      <div className="col-md-12">
        <div className="col-md-12 search-results">
        {hashtags.map((tag)=>{
          return <Link to={`/show/?hashtag=${tag}`} key={tag}>#{tag} </Link>
        })}
           {curTitle}
        </div>
        <div>
          <ul className="show-tables col-md-10 col-lg-10">
          {this.props.tables.map(this.renderTable)}
          </ul>
          <div className="col-md-2 col-lg-2 show-side-bar">
            {this.renderSidebar()}
          </div>
        </div>
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
