import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/app';
import Home from './components/home';
import NoMatch from './components/404'
import About from './components/about'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="about" component={About}/>
    <Route path="*" component={NoMatch}/>
  </Route>
);
