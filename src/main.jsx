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
import 'core-js/modules/es.object.values';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { NotificationPortal } from '@redhat-cloud-services/frontend-components-notifications';
import * as Sentry from '@sentry/browser';
import { SessionTiming } from '@sentry/integrations';

import { Api, Config } from 'openshift-assisted-ui-lib';

import { userInfoResponse } from './redux/actions/userActions';
import config from './config';
import App from './components/App/App';
import { store } from './redux/store';
import getBaseName from './common/getBaseName';
import { authInterceptor } from './services/apiRequest';
import { detectFeatures } from './redux/actions/featureActions';

import './styles/main.scss';

const basename = getBaseName();

/**
 * Assisted Installer configuration
 *
 * We need to pass axios auth interceptor so every request from AI has proper headers.
 *
 * We also need to set the route base path for the internal AI routing to work properly.
 */
Api.setAuthInterceptor(authInterceptor);
Config.setRouteBasePath('/assisted-installer');

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <>
        <NotificationPortal store={store} />
        <BrowserRouter basename={basename}>
          <App />
        </BrowserRouter>
      </>
    </Provider>,
    document.getElementById('root'),
  );
};

const renderDevEnvError = () => {
  ReactDOM.render(
    <div style={{ margin: '25px' }}>
      <h1>Development environment error</h1>
      <h2>You&apos;re accessing the webpack dev server directly</h2>
      <p>
        This app is designed to run within the Insights Chrome, and can&apos;t run without it.
      </p>
      <p>
        If you&apos;re already running the Insights Chrome Proxy, you just got the URL wrong.
        {' '}
        <a href="https://qa.foo.redhat.com:1337/openshift">
          Click here to access the app.
        </a>
      </p>
      <p>
        If you don&apos;t know what the Insights Chrome Proxy is or how to run it,
        {' '}
        consult README.adoc and README-tldr.md
      </p>
    </div>,
    document.body,
  );
};

const renderUnsupportedEnvError = () => {
  insights.chrome.init();
  insights.chrome.identifyApp('openshift');
  ReactDOM.render(
    <div style={{ margin: '25px' }}>
      <h1>Unsupported environment</h1>
      <h2>OCM does not support this environment</h2>
      <p>
        Please use one of our supported environments.
      </p>
      <p>
        OCM is only being deployed to this environment to ensure navigation keeps working.
      </p>
    </div>,
    document.getElementById('root'),
  );
};

if (!window.insights && process.env.NODE_ENV === 'development') {
  // we don't want this info to ever be complied to the prod build,
  // so I made sure it's only ever called in development mode
  renderDevEnvError();
} else if (APP_API_ENV === 'disabled') {
  // This is a build for an environment we don't support. render an error.
  renderUnsupportedEnvError();
} else {
  insights.chrome.init();
  insights.chrome.identifyApp('openshift');
  insights.chrome.auth.getUser()
    .then((data) => {
      store.dispatch(userInfoResponse(data.identity.user));
      config.fetchConfig()
        .then(() => {
          store.dispatch(detectFeatures());
          if (!config.override && config.configData.sentryDSN) {
            Sentry.init({
              dsn: config.configData.sentryDSN,
              integrations: [
                new SessionTiming(),
                new Sentry.Integrations.GlobalHandlers({
                  onerror: true,
                  onunhandledrejection: false,
                }),
              ],
            });
            if (data && data.identity && data.identity.user) {
              // add user info to Sentry
              Sentry.configureScope((scope) => {
                const { email, username } = data.identity.user;
                scope.setUser({ email, username });
              });
            }
          }
          render();
        });
    });
}
