import { Text, TextContent } from '@patternfly/react-core';
import React from 'react';
import PopoverHint from '~/components/common/PopoverHint';

export const WildcardPolicyPopover = () => (
  <PopoverHint
    title="Wildcard Policy"
    maxWidth="30rem"
    hint={
      <TextContent>
        <Text>If enabled, a route can have subdomains on its route.</Text>
      </TextContent>
    }
  />
);
