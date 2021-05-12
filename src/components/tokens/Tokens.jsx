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
// copy it and use it with command line utitilites like `curl` or OCM.

import React from 'react';
import PageHeader, { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import Skeleton from '@redhat-cloud-services/frontend-components/Skeleton';
import {
  PageSection, Card, CardBody, CardFooter, ClipboardCopy, CardTitle, Text, TextContent,
} from '@patternfly/react-core';
import './Tokens.scss';

/**
 * Splits the given text into lines of 80 characters each, so that they look
 * nice when rendered in a shell code snippet. Note that each line will have
 * a backslash at the end, for line continuation.
 */
const splitToken = (text) => {
  if (!text || !text.match) {
    return text;
  }
  const chunks = text.match(/.{1,80}/g);
  const lines = chunks.map(chunk => `${chunk}\\`);
  return lines.join('\n');
};

/**
 * Generates a box for containing the value of a token.
 */
const tokenBox = token => (
  <Text component="pre">
    <ClipboardCopy isReadOnly>{token}</ClipboardCopy>
  </Text>
);

/**
 * Generates a text box for snippet of code for the given text, removing all
 * the leading and trailing blank lines, and removing from all the lines the
 * number of blanks that appear in the first line.
 */
const snippetBox = lines => (
  <Text component="pre">
    {lines.join('\n')}
  </Text>
);

class Tokens extends React.Component {
  state = {
    offlineAccessToken: undefined,
  }

  componentDidMount() {
    const that = this;
    insights.chrome.auth.getOfflineToken().then((response) => {
      that.setState({ offlineAccessToken: response.data.refresh_token });
    }).catch((reason) => {
      if (reason === 'not available') {
        insights.chrome.auth.doOffline();
      } else {
        that.setState({ offlineAccessToken: reason });
      }
    });
  }

  render() {
    const { offlineAccessToken } = this.state;

    const title = (
      <PageHeader>
        <PageHeaderTitle title="OpenShift Cluster Manager API Token" />
      </PageHeader>
    );

    if (offlineAccessToken === undefined) {
      return (
        <>
          {title}
          <PageSection>
            <Card className="ins-c-card__skeleton">
              <CardTitle>
                <Skeleton size="md" />
              </CardTitle>
              <CardBody>
                <Skeleton size="lg" />
              </CardBody>
              <CardFooter>
                <Skeleton size="sm" />
              </CardFooter>
            </Card>
          </PageSection>
        </>
      );
    }

    // Prepare the snippet of code that shows how to use the offline access token:
    const offlineAccessTokenSnippet = [
      'ocm login --token="\\',
      splitToken(offlineAccessToken),
      '"',
    ];

    // Link to latest ocm release:
    const ocmLink = <a href="https://github.com/openshift-online/ocm-cli/releases/latest">ocm</a>;

    /* eslint-disable react/jsx-one-expression-per-line */
    return (
      <>
        {title}
        <PageSection>
          <Card className="ocm-c-api-token__card">
            <CardTitle>
              <h2>OpenShift Cluster Manager API Token</h2>
            </CardTitle>
            <CardBody className="ocm-c-api-token__card--body">
              <TextContent>
                <Text component="p">
                  Red Hat OpenShift Cluster Manager is a managed service that makes it easy for you
                  to use OpenShift without needing to install, operate or upgrade your own OpenShift
                  (Kubernetes) cluster.
                </Text>
                <Text component="p">
                  Download and install the {ocmLink} command-line utility and use the API token to
                  authenticate against your Red Hat OpenShift Cluster Manager account.
                </Text>
                {tokenBox(offlineAccessToken)}
                <Text component="p">
                  Copy it, and then use it to authenticate with the {ocmLink} command-line utility:
                </Text>
                {snippetBox(offlineAccessTokenSnippet)}
                <Text component="p">
                  Run <code>ocm login --help</code> to get more information.
                </Text>
              </TextContent>
            </CardBody>
          </Card>
        </PageSection>
      </>
    );
    /* eslint-enable react/jsx-one-expression-per-line */
  }
}

export default Tokens;
export {
  snippetBox,
  splitToken,
  tokenBox,
};
