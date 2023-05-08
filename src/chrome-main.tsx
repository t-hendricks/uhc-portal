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
import './i18n';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
// No type definitions
// @ts-ignore
import NotificationPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';

import * as Sentry from '@sentry/browser';
import { SessionTiming } from '@sentry/integrations';

import { OCM } from 'openshift-assisted-ui-lib';

import config from './config';

import getNavClickParams from './common/getNavClickParams';
import ocmBaseName from './common/getBaseName';

import { userInfoResponse } from './redux/actions/userActions';
import { detectFeatures } from './redux/actions/featureActions';

import { store } from './redux/store';
import { authInterceptor } from './services/apiRequest';

import App from './components/App/App';
import type { AppThunkDispatch } from './redux/types';

import './styles/main.scss';

const { Api, Config } = OCM;

/**
 * Assisted Installer configuration
 *
 * We need to pass axios auth interceptor so every request from AI has proper headers.
 *
 * We also need to set the route base path for the internal AI routing to work properly.
 */
Api.setAuthInterceptor(authInterceptor);
Config.setRouteBasePath('/assisted-installer');

// Chrome 2.0 renders this
class AppEntry extends React.Component {
  state = { ready: false };

  componentDidMount() {
    insights.chrome.init();
    insights.chrome.identifyApp('').then(() => {
      insights.chrome.appNavClick(getNavClickParams(window.location.pathname));
    });
    insights.chrome.auth.getUser().then((data) => {
      if (data?.identity?.user) {
        store.dispatch(userInfoResponse(data.identity.user));
      }
      config.fetchConfig().then(() => {
        (store.dispatch as AppThunkDispatch)(detectFeatures());
        this.setState({ ready: true });
        if (!config.envOverride && config.configData.sentryDSN) {
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
          if (data?.identity?.user) {
            const { email, username } = data.identity.user;
            // add user info to Sentry
            Sentry.configureScope((scope) => {
              scope.setUser({ email, username });
            });
          }
        }
      });
    });

    if (
      // app is running in local development
      APP_DEV_SERVER ||
      // app is not built in production mode
      APP_DEVMODE ||
      // build is not deployed in a production environment
      APP_API_ENV !== 'production'
    ) {
      insights.chrome.enable.segmentDev();
    }
  }

  render() {
    const { ready } = this.state;
    if (ready) {
      // HACK: react-router only looks at `basename` prop once on initialization, so this is
      //    fragile if we later jump between /preview & /beta.
      const basename = ocmBaseName();

      return (
        <Provider store={store}>
          <NotificationPortal />
          <BrowserRouter
            basename={basename}
            getUserConfirmation={() => {
              /* Block the default browser prompt (window.confirm). */
            }}
          >
            <App />
          </BrowserRouter>
        </Provider>
      );
    }
    return null;
  }
}
export default AppEntry;
