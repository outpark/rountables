import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Table from '../components/table';
import { listTables } from '../actions/list_tables'
import { fetchTables } from '../actions/search'
import { Button, Modal, OverlayTrigger } from 'react-bootstrap';
// import GoogleMap from '../components/google_map';

class TableList extends Component {
  constructor(props){
    super(props);
    this.state = {
      tables: []
    }
  }

  componentWillMount(){
    this.props.listTables();
  }

  renderTable(tableData){
    if(!tableData){
      console.log("NO DATA");
    }
    const ID = tableData._id;
    const title = tableData.title;
    const hashtags = tableData.hashtags;
    return(
      <li className="table" key={ID}>
      {title}
      <p className="hashtags">
      {hashtags.map(function(tag){
        return `#${tag} `
      })} </p>
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
  return bindActionCreators({ listTables }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TableList);
