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
import { CompatRouter } from 'react-router-dom-v5-compat';
import { Provider } from 'react-redux';

// No type definitions
// @ts-ignore
import NotificationPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';

import * as Sentry from '@sentry/browser';
import { sessionTimingIntegration } from '@sentry/integrations';

import * as OCM from '@openshift-assisted/ui-lib/ocm';

import { authInterceptor } from '~/services/apiRequest';

import { GenerateId } from '@patternfly/react-core';
import getNavClickParams from './common/getNavClickParams';
import ocmBaseName from './common/getBaseName';

import { userInfoResponse } from './redux/actions/userActions';
import { detectFeatures } from './redux/actions/featureActions';
import { store } from './redux/store';

import config from './config';

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
    config.dateConfig();
    insights.chrome.auth.getUser().then((data) => {
      if (data?.identity?.user) {
        store.dispatch(userInfoResponse(data.identity.user));
      }
      config.fetchConfig().then(() => {
        (store.dispatch as AppThunkDispatch)(detectFeatures());
        this.setState({ ready: true });
        if (!APP_DEV_SERVER && !config.envOverride && config.configData.sentryDSN) {
          Sentry.init({
            dsn: config.configData.sentryDSN,
            ...(APP_SENTRY_RELEASE_VERSION ? { release: APP_SENTRY_RELEASE_VERSION } : {}),
            autoSessionTracking: false,
            integrations: [
              sessionTimingIntegration(),
              Sentry.globalHandlersIntegration({
                onerror: true,
                onunhandledrejection: false,
              }),
            ],
          });
          if (data?.identity?.user) {
            const { email, username } = data.identity.user;
            // add user info to Sentry
            Sentry.getCurrentScope().setUser({ email, username });
          }
        }
      });
      // avoid collisions with generated PF IDs in masthead
      // workaround for:
      //   https://issues.redhat.com/browse/RHCLOUD-31437
      //   https://github.com/patternfly/patternfly-react/issues/10160
      GenerateId.defaultProps = { prefix: 'pf-random-ocmui-id-' };
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
            <CompatRouter>
              <App />
            </CompatRouter>
          </BrowserRouter>
        </Provider>
      );
    }
    return null;
  }
}
export default AppEntry;
