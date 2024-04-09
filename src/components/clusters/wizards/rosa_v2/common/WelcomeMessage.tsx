import React from 'react';

import { Text, TextContent, TextVariants } from '@patternfly/react-core';

export const WelcomeMessage: React.FC = () => (
  <TextContent>
    <Text component={TextVariants.h2}>Welcome to Red Hat OpenShift Service on AWS (ROSA)</Text>
    <Text component={TextVariants.p}>
      Create a managed OpenShift cluster on an existing Amazon Web Services (AWS) account.
    </Text>
  </TextContent>
);
