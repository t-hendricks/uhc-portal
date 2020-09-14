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
// they can copy it and use it with the moactl command line utitility.

import React from 'react';
import { Skeleton, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import {
  PageSection,
  Card,
  CardBody,
  CardFooter,
  Button, CardTitle,
} from '@patternfly/react-core';
import Tokens, { splitToken, snippetBox, tokenBox } from './Tokens';

// The <TokensMOA> component inherits from the <Tokens> component. This may
// cause breakage if ever we change the <Tokens> component heavily, but in the
// meantime prevents unnecessary code duplication with minimal effort.
class TokensMOA extends Tokens {
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
        <PageHeaderTitle title="Red Hat Managed OpenShift on AWS" />
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
      'moactl login --token="\\',
      splitToken(offlineAccessToken),
      '"',
    ];

    const awsURL = 'https://github.com/jeremyeder/quickstart';
    const moactlURL = 'https://github.com/openshift/moactl/releases/latest';
    const moactlLink = <a href={moactlURL}>moactl</a>;

    /* eslint-disable react/jsx-one-expression-per-line */
    return (
      <>
        {title}
        <PageSection>
          <Card>
            <CardTitle>
              <h2>Fully managed OpenShift clusters</h2>
            </CardTitle>
            <CardBody>
              <p>
                Red Hat Managed OpenShift on AWS is a managed service that makes it easy for you to
                use OpenShift on AWS without needing to install, operate or upgrade your own
                OpenShift (Kubernetes) cluster.
              </p>
              <p>
                Download and install the {moactlLink} command-line utility and use the Offline
                Access Token to authenticate against your Red Hat OpenShift Cluster Manager account.
              </p>
              {tokenBox(offlineAccessToken)}
              <p>
                Copy it, and then use it to authenticate with the {moactlLink} command-line utility:
              </p>
              {snippetBox(offlineAccessTokenSnippet)}
              <p>
                Run <code>moactl login --help</code> to get more information.
              </p>
              <a href={awsURL} target="_blank" rel="noopener noreferrer" className="pull-left">
                <Button variant="primary">Go back to AWS quickstart</Button>
              </a>
            </CardBody>
          </Card>
        </PageSection>
      </>
    );
    /* eslint-enable react/jsx-one-expression-per-line */
  }
}

export default TokensMOA;
