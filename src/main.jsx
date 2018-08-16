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
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import {
  applyMiddleware, compose, createStore,
} from 'redux';
import reduxThunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { AppContainer } from 'react-hot-loader';
import * as fromUsers from './ducks/users';
import config from './config';
import App from './components/app';
import reducers from './reducers';

import './styles/main.scss';

let keycloak;

const history = createBrowserHistory();
/* eslint-disable-next-line no-underscore-dangle */
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  connectRouter(history)(reducers),
  composeEnhancer(
    applyMiddleware(
      routerMiddleware(history), reduxThunk,
    ),
  ),
);

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <BrowserRouter>
          <App
            loginFunction={keycloak.login}
            logoutFunction={keycloak.logout}
            authenticated={keycloak.authenticated}
          />
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    document.getElementById('root'),
  );
};

// Hot reloading
if (module.hot) {
  // Reload components
  module.hot.accept('./components/clusters/ClustersPage', () => {
    render();
  });

  // Reload reducers
  module.hot.accept('./reducers', () => {
    store.replaceReducer(connectRouter(history)(reducers));
  });
}

function initKeycloak() {
  /* eslint-disable-next-line no-undef */
  keycloak = Keycloak(config.configData.keycloak);
  keycloak.init({ onLoad: 'check-sso', checkLoginIframe: false }).success((authenticated) => {
    if (authenticated) {
      sessionStorage.setItem('kctoken', keycloak.token);

      render();
      keycloak.loadUserProfile()
        .success((result) => {
          store.dispatch(fromUsers.userInfoResponse(result));
        })
        .error((err) => {
          console.log(err); // should probably redirect to an error page
        });

      setInterval(() => {
        keycloak.updateToken(10)
          .success(() => sessionStorage.setItem('kctoken', keycloak.token))
          .error(() => keycloak.logout());
      }, 10000);
    } else {
      render();
    }
  });
}

config.fetchConfig().then(() => {
  initKeycloak();
});
