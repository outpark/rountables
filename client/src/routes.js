import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/app';
import Home from './components/home';
import NoMatch from './components/404'
import About from './components/about'
import Show from './components/tables_show';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="show" component={Show} />
    <Route path="about" component={About}/>
    <Route path="*" component={NoMatch}/>
  </Route>
);
