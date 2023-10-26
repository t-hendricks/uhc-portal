import { Button } from '@patternfly/react-core';
import React from 'react';

// Intercom is configured to open the chat when the button with the text "Contact support" is clicked.
const RosaHandsOnContactSupport = () => (
  <Button variant="link" isInline data-analytics-id="contact-support">
    contact support
  </Button>
);

export default RosaHandsOnContactSupport;
