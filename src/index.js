import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

// Router Stuff
import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import { connectRouter, routerMiddleware, ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import { App } from './containers';
import * as Reducers from './redux/reducers';
import './css/index.css';

const history = createBrowserHistory({
  basename: process.env.PUBLIC_URL
});
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  connectRouter(history)(
    combineReducers(Reducers)
  ),
  composeEnhancer(
    applyMiddleware(
      routerMiddleware(history),
      thunk
    )
  )
);

console.log(store.getState());
ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App/>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
