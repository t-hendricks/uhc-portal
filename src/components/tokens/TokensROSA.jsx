/*
Copyright (c) 2020 Red Hat, Inc.

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

// This component shows to the user the OpenID refresh token, so that
// they can copy it and use it with the rosa command line utitility.

import React from 'react';
import { Skeleton, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import {
  PageSection,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Text,
  TextContent,
} from '@patternfly/react-core';
import Tokens, { splitToken, snippetBox, tokenBox } from './Tokens';
import links from '../../common/installLinks';

// The <TokensROSA> component inherits from the <Tokens> component. This may
// cause breakage if ever we change the <Tokens> component heavily, but in the
// meantime prevents unnecessary code duplication with minimal effort.
class TokensROSA extends Tokens {
  componentDidMount() {
    const { blockedByTerms = false } = this.props;
    if (!blockedByTerms) {
      // it reaches SSO for offline token.
      super.componentDidMount();
    }
  }

  render() {
    const { blockedByTerms = false } = this.props;
    const { offlineAccessToken } = this.state;

    const title = (
      <PageHeader>
        <PageHeaderTitle title="Red Hat OpenShift Service on AWS" />
      </PageHeader>
    );

    if (offlineAccessToken === undefined || blockedByTerms) {
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
      'rosa login --token="\\',
      splitToken(offlineAccessToken),
      '"',
    ];

    const docsLink = (
      <a href={links.ROSA_DOCS} target="_blank" rel="noopener noreferrer">documentation</a>
    );
    const rosaLink = (
      <a href={links.ROSA_CLIENT_LATEST} target="_blank" rel="noopener noreferrer">rosa</a>
    );

    /* eslint-disable react/jsx-one-expression-per-line */
    return (
      <>
        {title}
        <PageSection>
          <Card className="ocm-c-api-token__card">
            <CardTitle>Fully managed OpenShift clusters</CardTitle>
            <CardBody className="ocm-c-api-token__card--body">
              <TextContent>
                <Text component="p">
                  Red Hat OpenShift Service on AWS is a managed service that makes it easy for you
                  to use OpenShift on AWS without needing to install, operate or upgrade your own
                  OpenShift (Kubernetes) cluster.
                </Text>
                <Text component="p">
                  To download the client:
                  <ol>
                    <li>Download and install the {rosaLink} command-line utility (CLI).</li>
                    <li>
                      Copy the following Offline Access Token and use it to authenticate with
                      the {rosaLink} CLI:
                    </li>
                  </ol>
                </Text>
                {tokenBox(offlineAccessToken)}
                {snippetBox(offlineAccessTokenSnippet)}
                <Text component="p">
                  For help, run <code>rosa login --help</code> or see the {docsLink} for more
                  information about setting up the <code>rosa</code> (CLI).
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

export default TokensROSA;
