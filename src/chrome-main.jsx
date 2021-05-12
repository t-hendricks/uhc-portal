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
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import NotificationPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import { Api, Config } from 'openshift-assisted-ui-lib';
import App from './components/App/App';
import { store } from './redux/store';
import getBaseName from './common/getBaseName';
import { authInterceptor } from './services/apiRequest';
import './styles/main.scss';

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
const AppEntry = () => (
  <Provider store={store}>
    <NotificationPortal store={store} />
    <BrowserRouter basename={getBaseName()}>
      <App />
    </BrowserRouter>
  </Provider>
);

export default AppEntry;
