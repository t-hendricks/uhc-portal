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
import 'core-js/es6/promise';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import Keycloak from 'keycloak-js';

import { store } from './redux/store';
import { userInfoResponse } from './redux/actions/userActions';
import Tokens from './components/tokens/Tokens';
import App from './components/App/App';
import RouterlessHeader from './components/App/RouterlessHeader';
import config from './config';


import './styles/main.scss';

let keycloak;

const render = (authenticated) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <App
          authenticated={authenticated}
          loginFunction={keycloak.login}
          logoutFunction={keycloak.logout}
          HeaderComponent={RouterlessHeader}
        >
          <Tokens accessToken={keycloak.token} refreshToken={keycloak.refreshToken} />
        </App>
      </Provider>
    </AppContainer>,
    document.getElementById('root'),
  );
};

// Hot reloading
if (module.hot) {
  // Reload reducers
  module.hot.accept();
}

function initKeycloak() {
  keycloak = Keycloak(config.configData.keycloak);
  const loginSuccess = (authenticated) => {
    store.dispatch(userInfoResponse(keycloak.idTokenParsed));
    render(authenticated);
  };
  keycloak.init({ onLoad: 'check-sso', checkLoginIframe: false }).success((authenticated) => {
    if (authenticated) {
      loginSuccess(authenticated);
    } else {
      keycloak.login({ scope: 'offline_access' }).success(loginSuccess);
    }
  });
}

if (APP_EMBEDDED) {
  document.querySelector('.layout-pf.layout-pf-fixed').classList.remove('layout-pf', 'layout-pf-fixed');
  insights.chrome.init();
  insights.chrome.auth.getUser().then(() => {
    keycloak = {
      login: () => undefined,
      logout: () => insights.chrome.auth.logout(),
      authenticated: true,
    };
    render(); // TODO: Figure out how to get offline_access token when chromed!
  });
} else {
  config.fetchConfig().then(() => {
    // If running using webpack-server development server, and setting env
    // variable `UHC_DISABLE_KEYCLOAK` to `true`, disable keycloak.
    if (process.env.UHC_DISABLE_KEYCLOAK === 'true') {
      keycloak = {
        login: () => { },
        logout: () => { },
        token: 'fake token for mock mode',
        authenticated: true,
      };
      render();
    } else {
      initKeycloak();
    }
  });
}
