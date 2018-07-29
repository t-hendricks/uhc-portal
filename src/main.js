/*
Copyright (c) 2018 Red Hat, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. 
*/

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import PortalRouter from './portalRouter';
import { Provider } from 'react-redux'
import registerServiceWorker from './registerServiceWorker';
import * as fromUsers from './ducks/users';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import reduxThunk from 'redux-thunk';
import { createBrowserHistory } from 'history'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { AppContainer } from 'react-hot-loader'
import reducers from './reducers'

export const keycloak = Keycloak('/keycloak.json')
keycloak.init({ onLoad: 'check-sso', checkLoginIframeInterval: 1 }).success(authenticated => {
  if (keycloak.authenticated) {
    sessionStorage.setItem('kctoken', keycloak.token);

    keycloak.loadUserProfile()
      .success(result => {
        store.dispatch(fromUsers.userInfoResponse(result))
      })
      .error(err => {
        console.log(err) // should probably redirect to an error page
      })

    setInterval(() => {
      keycloak.updateToken(10)
        .success(() => sessionStorage.setItem('kctoken', keycloak.token))
        .error(() => keycloak.logout());
    }, 10000);
  } else {
      keycloak.login(); // comment this out if you dont care about logging in
  }
});


const history = createBrowserHistory()

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  connectRouter(history)(reducers),
  composeEnhancer(
    applyMiddleware(
      routerMiddleware(history), reduxThunk
    ),
  ),
)

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <PortalRouter history={history} />
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  )
}

render()

// Hot reloading
if (module.hot) {
  // Reload components
  module.hot.accept('./App', () => {
    console.log("App hot reload") // never seen this happening 
    render()
  })

  // Reload reducers
  module.hot.accept('./reducers', () => {
    console.log("reducers hot reload") // never seen this happening 
    store.replaceReducer(connectRouter(history)(reducers))
  })
}

registerServiceWorker();
