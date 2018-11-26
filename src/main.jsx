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
import './common/arrayIncludePollyfill';
import 'core-js/es6/promise';
import 'core-js/modules/es6.string.starts-with';
import 'core-js/modules/es6.string.ends-with';
import 'core-js/modules/es6.number.is-nan';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import Keycloak from 'keycloak-js';
import { userInfoResponse } from './redux/actions/userActions';
import config from './config';
import App from './components/app';
import { store, reloadReducers } from './redux/store';

import './styles/main.scss';

let keycloak;

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
  // Reload reducers
  module.hot.accept('./redux/reducers', reloadReducers);

  module.hot.accept();
}

function initKeycloak() {
  keycloak = Keycloak(config.configData.keycloak);
  keycloak.init({ onLoad: 'login-required', checkLoginIframe: false }).success((authenticated) => {
    if (authenticated) {
      sessionStorage.setItem('kctoken', keycloak.token);

      store.dispatch(userInfoResponse(keycloak.idTokenParsed));
      render();

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
  // If running using webpack-server development server, and setting env
  // variable `UHC_DISABLE_KEYCLOAK` to `true`, disable keycloak.
  if (process.env.UHC_DISABLE_KEYCLOAK === 'true') {
    keycloak = {
      login: () => {},
      logout: () => {},
      authenticated: true,
    };
    render();
  } else {
    initKeycloak();
  }
});
