import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { listTables } from '../actions/list_tables'
import { Button, Modal, OverlayTrigger } from 'react-bootstrap';
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
      <li className="table" key={ID}>
      <Link to={`/table/${ID}`}>{title}</Link>
      <div className="hashtags">
      {hashtags.map(function(tag){
        return <Link to={`/show/?hashtag=${tag}`} key={tag} onClick={myThis.handleClick}>#{tag} </Link>
      })} </div>
      </li>
    );
  }

  render() {
    if(this.props.tables === undefined){
      return(
        <div className='col-md-12'>...loading</div>
      );
    }
    return (
      <div>
        <h3 className='col-md-12 table-header'>Tables</h3>
        <ul className="table-container">
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
