import React from 'react';

import { Button } from '@patternfly/react-core';

const INTERCOM_OPEN_AUTH_CHAT_ID = 'qualify-rosa-he';
const INTERCOM_OPEN_CHAT_ID = 'contact-support';

// Intercom is configured to open the default support chat when the button with the attribute data-analytics-id="contact-support" is clicked.

export const RosaHandsOnContactSupport = () => (
  <Button variant="link" isInline data-analytics-id={INTERCOM_OPEN_CHAT_ID}>
    contact support
  </Button>
);

// Intercom is configured to open the chat with the custom authorization conversation when a button with attribute data-analytics-id="qualify-rosa-he" is clicked.

export const RosaHandsOnRequestAuthorization = () => (
  <Button variant="link" isInline data-analytics-id={INTERCOM_OPEN_AUTH_CHAT_ID}>
    additional information
  </Button>
);
