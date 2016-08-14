import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/app';
import Home from './components/home';
import NoMatch from './components/404'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="*" component={NoMatch}/>
  </Route>
);
