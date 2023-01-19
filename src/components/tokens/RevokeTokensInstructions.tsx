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
          <b>SSO application management</b>
        </ExternalLink>{' '}
        page.
      </ListItem>
      <ListItem>
        Locate the <b>cloud-services</b> client ID, expand the row if necessary.
      </ListItem>
      <ListItem>
        Select <b>Remove access</b>.
      </ListItem>
    </List>

    <Text>
      All refresh tokens will stop working immediately after you Remove access, but existing access
      tokens (which are cached by <code>ocm</code> and <code>rosa</code> commands) may take up to 15
      minutes to expire.
    </Text>

    <Text>Refresh this page afterwards to generate a new token.</Text>
  </TextContent>
);

export default RevokeTokensInstructions;
