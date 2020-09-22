import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import Main from 'pages/main';
import Event from 'pages/event';

const App = (props) => {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Main} />
        <Route path="/event/:id" component={Event} />
      </Switch>
    </Router>
  );
}

export default connect()(App);
