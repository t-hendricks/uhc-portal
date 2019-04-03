/*
Copyright (c) 2019 Red Hat, Inc.

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

// This component shows to the user the OpenID refresh token, so that she can
// copy it and use it with command line utitilites like `curl` or UHC.

import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'patternfly-react';
import AlphaNotice from '../common/AlphaNotice';

/**
 * Splits the given text into lines of 72 characters each, so that they look
 * nice when rendered in a shell code snippet. Note that each line will have
 * a backslash at the end, for line continuation.
 */
const splitToken = (text) => {
  const chunks = text.match(/.{1,80}/g);
  const lines = chunks.map(chunk => `${chunk}\\`);
  return lines.join('\n');
};

/**
 * Generates a box for containing the value of a token.
 */
const tokenBox = token => (
  <div className="token-value">
    <pre>{token}</pre>
  </div>
);

/**
 * Generates a text box for snippet of code for the given text, removing all
 * the leading and trailing blank lines, and removing from all the lines the
 * number of blanks that appear in the first line.
 */
const snippetBox = lines => (
  <div className="token-snippet">
    <pre>{lines.join('\n')}</pre>
  </div>
);

const Tokens = ({ accessToken, refreshToken }) => {
  // Prepare the snippet of code that shows how to use the access token:
  const accessTokenSnippet = [
    'ACCESS_TOKEN="\\',
    splitToken(accessToken),
    '"',
    'curl \\',
    '--silent \\',
    `--header "Authorization: Bearer ${'${'}ACCESS_TOKEN${'}'}" \\`,
    'https://api.openshift.com/api/clusters_mgmt/v1/clusters | \\',
    'jq .',
  ];

  // Prepare the snippet of code that shows how to use the refresh token:
  const refreshTokenSnippet = [
    'REFRESH_TOKEN="\\',
    splitToken(refreshToken),
    '"',
    'curl \\',
    '--silent \\',
    '--data-urlencode "grant_type=refresh_token" \\',
    '--data-urlencode "client_id=uhc" \\',
    `--data-urlencode "refresh_token=${'${'}REFRESH_TOKEN${'}'}" \\`,
    'https://developers.redhat.com/auth/realms/rhd/protocol/openid-connect/token | \\',
    'jq -r .access_token',
  ];

  // Links to curl and jq:
  const curlLink = <a href="https://curl.haxx.se">curl</a>;
  const jqLink = <a href="https://stedolan.github.io/jq">jq</a>;

  // Render the component:
  /* eslint-disable react/jsx-one-expression-per-line */
  return (
    <div>
      <AlphaNotice />
      <div className="token-details">

        <h2>API Tokens</h2>

        <h3>Access Token</h3>
        <p>
          This access token is a kind of password that can be used to access
          the API:
        </p>
        {tokenBox(accessToken)}
        <p>
          Copy it, and then add it to the authorization header of the API
          request. For example, to obtain your list of clusters using the
          API with the {curlLink} and {jqLink} command line tools, use the
          following commands:
        </p>
        {snippetBox(accessTokenSnippet)}
        <Alert type="warning">
          <p>
            Note that this token is short lived, usually only five minutes. If
            you need a long lived token then you can use the refresh token
            available below, but then you will need a tool that knows how
            to obtain an access token from that refresh token.
          </p>
        </Alert>

        <h3>Refresh Token</h3>
        <p>
          This is a long lived token that you can use to obtain access tokens:
        </p>
        {tokenBox(refreshToken)}
        <p>
          Copy it, and then use it o request an access token. For example, to
          obtain an access token using the {curlLink} and {jqLink} command
          line tools, use the following commands:
        </p>
        {snippetBox(refreshTokenSnippet)}

      </div>
    </div>
  );
  /* eslint-enable react/jsx-one-expression-per-line */
};

Tokens.propTypes = {
  accessToken: PropTypes.string.isRequired,
  refreshToken: PropTypes.string.isRequired,
};

export default Tokens;
