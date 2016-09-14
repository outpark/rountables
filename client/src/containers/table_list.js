import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { listTables } from '../actions/list_tables'
import { Button, Modal, OverlayTrigger, Carousel } from 'react-bootstrap';
import { Link } from 'react-router';
// import GoogleMap from '../components/google_map';
import { fetchTables } from '../actions/search'; // implement this

class TableList extends Component {
  constructor(props){
    super(props);
    this.state = {
      tables: []
    }
    this.handleClick = this.handleClick.bind(this);
    this.renderTable = this.renderTable.bind(this);

  }

  componentWillMount(){
    this.props.listTables();
  }

  // Not sure if this is necessary.
  handleClick(event) {
    this.setState({tables:[]});
  }

  renderTable(tableData){
    if(!tableData){
      console.log("No table data.");
    }
    const ID = tableData._id;
    const title = tableData.title;
    const hashtags = tableData.hashtags;
    const myThis = this;
    // change Link to router method
    return(
      <li className="col-md-6 col-xs-12 col-lg-4" key={ID}>
      <Carousel className="table round-border">
      <Carousel.Item>
        <img width={300} height={300} alt="900x500" src="/img/wintergarden.jpg"/>
        <Carousel.Caption>
          <div className="t-title-main">
            <Link to={`/table/${ID}`}>{title}</Link>
          </div>
          <div className="hashtags">
          {hashtags.map(function(tag){
            return <Link to={`/show/?hashtag=${tag}`} key={tag} onClick={myThis.handleClick}>#{tag} </Link>
          })} </div>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img width={300} height={300} src="/img/wintergarden.jpg"/>
        <Carousel.Caption>
          <p>{tableData.description}</p>
        </Carousel.Caption>
      </Carousel.Item>
      </Carousel>
      </li>
    );

  }

  render() {
    if(this.props.tables === undefined || this.props.tables.length === undefined){
      return(
        <i className="fa fa-spinner fa-spin fa-3x fa-fw spinner-container col-md-12 col-xs-12" style={{fontSize:100}}></i>
      );
    }

    return (
      <div>
        <h3 className='table-header col-md-12 col-xs-12 col-lg-12'>Tables</h3>
        <ul className="table-container col-md-12 col-xs-12 col-lg-12">
          {this.props.tables.map(this.renderTable)}
        </ul>
      </div>

    );
  }
}

function mapStateToProps(state){
  return { tables: state.tableList.tables };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ listTables, fetchTables }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TableList);
