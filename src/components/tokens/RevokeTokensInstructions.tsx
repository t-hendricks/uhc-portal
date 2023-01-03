import React from 'react';
import { TextContent, Text, List, ListItem } from '@patternfly/react-core';
import ExternalLink from '../common/ExternalLink';
import './RevokeTokensInstructions.scss';

type Props = {
  reason?: string;
};

const RevokeTokensInstructions = ({ reason }: Props) => (
  <TextContent className="ocm-c-revoke-tokens">
    {reason && (
      <p className="pf-u-mt-sm">
        <strong>{reason}</strong>
      </p>
    )}

    <Text>To manage and revoke previous tokens:</Text>

    <List component="ol">
      <ListItem>
        Navigate to the{' '}
        <ExternalLink href="https://sso.redhat.com/auth/realms/redhat-external/account/#/applications">
          <b>offline API token management</b>
        </ExternalLink>{' '}
        page.
      </ListItem>
      <ListItem>
        Locate the <b>cloud-services</b> application.
      </ListItem>
      <ListItem>
        Select <b>Revoke grant</b>.
      </ListItem>
    </List>

    <Text>
      Refresh tokens will stop working immediately after you revoke them, but existing access tokens
      may take up to 15 minutes to expire.
    </Text>

    <Text>Refresh this page afterwards to generate a new token.</Text>
  </TextContent>
);

export default RevokeTokensInstructions;
