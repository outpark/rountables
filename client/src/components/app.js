import React, { Component } from 'react';
import SearchBar from '../containers/search_bar';
import Favicon from 'react-favicon';

export default class App extends Component {
  render() {
    return (
      <div>
        <Favicon url={"./img/RT_Favicon.png"}/>
        <SearchBar />
      </div>
    );
  }
}
