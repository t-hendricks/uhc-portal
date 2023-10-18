import { Button } from '@patternfly/react-core';
import React from 'react';

// Intercom is configured to open the chat when the button with the text "Contact support" is clicked.
// Does not work in development environment
const RosaHandsOnContactSupport = () => (
  <Button variant="link" isInline>
    contact support
  </Button>
);

export default RosaHandsOnContactSupport;
