import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash'

const App = (props) => {
  return (
    <Router>
      <Switch>
        <Route path="/" />
      </Switch>
    </Router>
  );
}

export default connect()(App);
