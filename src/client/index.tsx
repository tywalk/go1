import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AppContainer } from "react-hot-loader";
import * as serviceWorker from './serviceWorker';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './reducers';
import 'public/assets/scss/main.scss'

const store = createStore(rootReducer);

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <React.StrictMode>
        <Provider store={store}>
            <Component />
        </Provider>
      </React.StrictMode>
    </AppContainer>,
    document.getElementById("container")
  );
};

if ((module as any).hot) {
  // (module as any).hot.accept();
  (module as any).hot.accept("./App", () => {
    const NextApp = require("./App").default;
    render(NextApp);
  });
}

render(App);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
