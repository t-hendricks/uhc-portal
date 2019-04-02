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
import 'core-js/modules/es7.object.values';
import detectPassiveEvents from 'detect-passive-events';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import Keycloak from 'keycloak-js';
import { userInfoResponse, getOrganization } from './redux/actions/userActions';
import { getCloudProviders } from './redux/actions/cloudProviderActions';
import config from './config';
import App from './components/App/App';
import { store, reloadReducers } from './redux/store';

import './styles/main.scss';

let keycloak;

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <BrowserRouter basename={APP_EMBEDDED ? '/insights/platform/uhc' : 'clusters'}>
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

function addPassiveListener(eventName, callback) {
  if (detectPassiveEvents.hasSupport) {
    // passive tells browser it won't preventDefault(), allowing scroll optimizations
    document.addEventListener(eventName, callback, { capture: false, passive: true });
  } else {
    document.addEventListener(eventName, callback, false);
  }
}

function initKeycloak() {
  keycloak = Keycloak(config.configData.keycloak);
  keycloak.init({ onLoad: 'login-required', checkLoginIframe: false }).success((authenticated) => {
    if (authenticated) {
      sessionStorage.setItem('kctoken', keycloak.token);

      store.dispatch(userInfoResponse(keycloak.idTokenParsed));
      // fetch cloud providers + organization as soon as possible, for lower latency
      store.dispatch(getCloudProviders());
      store.dispatch(getOrganization());
      render();

      const IDLE_TIMEOUT_SECONDS = 18 * 60 * 60; // 18 hours
      const resetCounter = () => {
        localStorage.setItem('lastActiveTimestamp', Math.floor(Date.now() / 1000));
      };
      resetCounter();

      addPassiveListener('click', resetCounter);
      addPassiveListener('keypress', resetCounter);
      addPassiveListener('touchstart', resetCounter);
      addPassiveListener('touchmove', resetCounter);
      addPassiveListener('wheel', resetCounter);

      const tokenRefreshTimer = () => {
        const lastActiveTimestamp = parseInt(localStorage.getItem('lastActiveTimestamp') || '0', 10);
        const idleSeconds = Math.floor(Date.now() / 1000) - lastActiveTimestamp;
        if (idleSeconds < IDLE_TIMEOUT_SECONDS) {
          keycloak.updateToken(10)
            .success(() => sessionStorage.setItem('kctoken', keycloak.token))
            .error(() => keycloak.logout());
        } else if (document.visibilityState === 'visible') {
          keycloak.logout();
        }
      };
      setInterval(tokenRefreshTimer, 10000);
      // ensure the keycloak token is refreshed if the document becomes visible
      // and the idle timeout was not reached
      document.addEventListener('visibilitychange', tokenRefreshTimer, false);
    } else {
      render();
    }
  });
}

if (APP_EMBEDDED) {
  document.querySelector('.layout-pf.layout-pf-fixed').classList.remove('layout-pf', 'layout-pf-fixed');
  insights.chrome.init();
  insights.chrome.auth.getUser().then((data) => {
    store.dispatch(userInfoResponse(data));
    store.dispatch(getCloudProviders());
    keycloak = {
      login: () => undefined,
      logout: () => insights.chrome.auth.logout(),
      authenticated: true,
    };
    render();
  });
} else {
  config.fetchConfig().then(() => {
    // If running using webpack-server development server, and setting env
    // variable `UHC_DISABLE_KEYCLOAK` to `true`, disable keycloak.
    if (process.env.UHC_DISABLE_KEYCLOAK === 'true') {
      keycloak = {
        login: () => { },
        logout: () => { },
        authenticated: true,
      };
      store.dispatch(userInfoResponse({ email: '***REMOVED***', name: 'mock username' }));
      render();
    } else {
      initKeycloak();
    }
  });
}
