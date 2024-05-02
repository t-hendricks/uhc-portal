import React from 'react';

import { Button } from '@patternfly/react-core';

interface ViewTermsButtonProps {
  href: string;
}

export const ViewTermsButton = ({ href }: ViewTermsButtonProps) => (
  <Button variant="primary" data-no-nav-prompt component="a" href={href}>
    View Terms and Conditions
  </Button>
);
