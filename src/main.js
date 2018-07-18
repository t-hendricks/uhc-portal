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
import App from './App';
import { Provider } from 'react-redux'
import registerServiceWorker from './registerServiceWorker';
import store from './store';
import * as fromUsers from './ducks/users';
import * as fromItems from './ducks/items';

export const keycloak = Keycloak()
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

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker();
