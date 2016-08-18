import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Table from '../components/table';
import { listTables } from '../actions/list_tables'
import { fetchTables, fetchDetailTables } from '../actions/search'
import { Button, Modal, OverlayTrigger } from 'react-bootstrap';
// import GoogleMap from '../components/google_map';

class TableShowList extends Component {
  constructor(props){
    super(props);
    this.state = {
      tables: []
    }
  }

  renderTable(tableData){
    if(!tableData){
      console.log("NO DATA");
    }
    const ID = tableData._id;
    const title = tableData.title;
    const hashtags = tableData.hashtags;
    return(
      <li className="col-md-3 table-show" key={ID}>
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
      this.props.listTables();
      return(
        <div className='col-md-12'>...loading</div>
      );
    }
    return (
      <div>
        <ul className="col-md-10 col-lg-10">
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

export default connect(mapStateToProps, mapDispatchToProps)(TableShowList);
