import React from 'react';
import { Skeleton, Stack, StackItem } from '@patternfly/react-core';

export const MachineConfigurationSkeleton = () => (
  <Stack hasGutter>
    <StackItem>
      <Skeleton width="200px" fontSize="md" />
    </StackItem>
    <StackItem>
      <Skeleton width="100%" fontSize="4xl" />
    </StackItem>
    <StackItem>
      <Skeleton width="200px" fontSize="4xl" screenreaderText="Loading PIDs limit" />
    </StackItem>
  </Stack>
);
