import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// import { fetchTable } from '../actions/index';
import { fetchTables } from '../actions/search'; // implement this
import { listTables } from '../actions/list_tables';

export default class SearchBar extends Component {
  constructor(props){
    super(props);
    this.state = { hashtag: []}

    this.onInputChange = this.onInputChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onSpacebar = this.onSpacebar.bind(this);
  }

  onInputChange(event){
    this.setState({ hashtag: event.target.value });
  }

  onSpacebar(event){
    if(event.which === 32){
      let tags = event.target.value.split(/[ ,]+/);
      console.log(tags.type);
      this.setState({ hashtag: tags });
      console.log(this.state);
      this.props.fetchTables(tags);
    }
  }

  onFormSubmit(event){
     event.preventDefault();
     // We need to go and fetch weather data
     console.log("ON SUBMIT: "+this.state.hashtag)
     let tags = this.state.hashtag.split(/[ ,]+/);
     this.props.fetchTables(tags);
     this.setState({ hashtag: [] });
     // fetch data and reset hashtag
  }

  render() {
    return (
      <form onSubmit={this.onFormSubmit} className="input-group">
        <input
          placeholder="Search for a hashtag"
          className="form-control"
          value={this.state.hashtag}
          onChange={this.onInputChange}
          onKeyPress={this.onSpacebar}
        />
        <span className="input-group-btn">
          <button type="submit" className="btn btn-secondary">
          submit
          </button>
        </span>
      </form>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchTables, listTables }, dispatch);
}

export default connect(null, mapDispatchToProps)(SearchBar);
