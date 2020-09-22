import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import Main from 'pages/main';

const App = (props) => {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Main} />
        <Route path="/event/:id" component={Main} />
      </Switch>
    </Router>
  );
}

export default connect()(App);
