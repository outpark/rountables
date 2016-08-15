import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Table from '../components/table';
import { listTables } from '../actions/list_tables'
import { fetchTables } from '../actions/search'
// import GoogleMap from '../components/google_map';

class TableList extends Component {
  constructor(props){
    super(props);
    this.state = { tables: []}

  }

  renderTable(tableData){
    if(!tableData){
      console.log("NO DATA");
    }
    const title = tableData.title;
    const hashtags = tableData.hashtags;
    return(
      <tr key={title}>
        <td>{title}</td>
        <td>{hashtags.map(function(tag){
          return <div key={tag}>#{tag}</div>
        })}</td>
      </tr>
    );
  }

  render() {
    if(this.props.tables === undefined){
      this.props.listTables();
      return(
        <div>...loading</div>
      );
    }
    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Tables</th>
          </tr>
        </thead>
        <tbody>
          {this.props.tables.map(this.renderTable)}
        </tbody>
      </table>
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
