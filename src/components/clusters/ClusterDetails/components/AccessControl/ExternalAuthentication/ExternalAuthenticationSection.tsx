import React from 'react';

import { Card, CardBody, Title } from '@patternfly/react-core';

import links from '../../../../../../common/installLinks.mjs';
import ExternalLink from '../../../../../common/ExternalLink';

import { BreakGlassCredentialList } from './BreakGlassCredentialList';
import { ExternalAuthProviderList } from './ExternalAuthProviderList';

export function ExternalAuthenticationSection() {
  return (
    <Card>
      <CardBody>
        <Title className="card-title" headingLevel="h3" size="lg">
          External authentication
        </Title>
        <p>
          Allow authentication to be handled by an external provider.
          <ExternalLink href={links.IDP_OPENID}> Learn more.</ExternalLink>
        </p>

        <ExternalAuthProviderList />
      </CardBody>
      <CardBody>
        <BreakGlassCredentialList />
      </CardBody>
    </Card>
  );
}
