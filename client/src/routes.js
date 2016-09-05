import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/app';
import Home from './pages/home';
import NoMatch from './pages/404'
import About from './pages/about'
import Show from './pages/tables_show';
import Table from './pages/table';
import User from './pages/user_profile';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="show" component={Show} />
    <Route path="about" component={About}/>
    <Route path="table/:table_id" component={Table}/>
    <Route path="user/:user_id" component={User}/>
    <Route path="*" component={NoMatch}/>
  </Route>
);
