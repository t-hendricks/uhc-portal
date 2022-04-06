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
import {
  Text,
  Title,
} from '@patternfly/react-core';
import ExternalLink from '../common/ExternalLink';
import Tokens from './Tokens';
import links, { tools } from '../../common/installLinks.mjs';

// The <TokensROSA> component inherits from the <Tokens> component. This may
// cause breakage if ever we change the <Tokens> component heavily, but in the
// meantime prevents unnecessary code duplication with minimal effort.
class TokensROSA extends Tokens {
  commandName = 'rosa'

  commandTool = tools.ROSA

  // Some methods here don't use `this`, but we can't convert to Class.method() calls,
  // wouldn't allow TokensROSA which inhertis from Tokens to override them.
  /* eslint-disable class-methods-use-this */
  leadingInfo() {
    return (
      <>
        <Text component="p">
          Red Hat OpenShift Service on AWS is a managed service that
          makes it easy for you to use OpenShift on AWS without needing to
          install, operate or upgrade your own OpenShift (Kubernetes) cluster.
        </Text>
        <Title headingLevel="h3">Your API token</Title>
        <Text component="p">
          Use this API token to authenticate against your
          Red Hat OpenShift Service on AWS account.
        </Text>
      </>
    );
  }

  docsLink() {
    return (
      <ExternalLink href={links.ROSA_CLI_DOCS} noIcon>
        read more about setting up the rosa CLI
      </ExternalLink>
    );
  }
}

export default TokensROSA;
