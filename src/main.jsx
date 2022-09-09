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
import fromEntries from 'object.fromentries';
import AppEntry from './chrome-main';

if (!Object.fromEntries) {
  fromEntries.shim();
}

const renderDevEnvError = () => {
  ReactDOM.render(
    <div style={{ margin: '25px' }}>
      <h1>Development environment error</h1>
      <h2>You&apos;re accessing the webpack dev server directly</h2>
      <p>This app is designed to run within the Insights Chrome, and can&apos;t run without it.</p>
      <p>
        If you&apos;re already running the Insights Chrome Proxy, you just got the URL wrong.{' '}
        <a href="https://qa.foo.redhat.com:1337/openshift">Click here to access the app.</a>
      </p>
      <p>
        If you don&apos;t know what the Insights Chrome Proxy is or how to run it, consult README.md
        and README-tldr.md
      </p>
    </div>,
    document.body,
  );
};

const renderUnsupportedEnvError = () => {
  ReactDOM.render(
    <div style={{ margin: '25px' }}>
      <h1>Unsupported environment</h1>
      <h2>OCM does not support this environment</h2>
      <p>Please use one of our supported environments.</p>
      <p>OCM is only being deployed to this environment to ensure navigation keeps working.</p>
    </div>,
    document.getElementById('root'),
  );
};

if (!window.insights && APP_DEV_SERVER) {
  // we don't want this info to ever be complied to the prod build,
  // so I made sure it's only ever called in development mode
  renderDevEnvError();
} else if (APP_API_ENV === 'disabled') {
  // This is a build for an environment we don't support. render an error.
  renderUnsupportedEnvError();
} else {
  ReactDOM.render(<AppEntry />, document.getElementById('root'));
}
