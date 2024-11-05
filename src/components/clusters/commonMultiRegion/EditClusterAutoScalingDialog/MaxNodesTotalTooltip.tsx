import React from 'react';

import { List, ListItem, Text, TextContent } from '@patternfly/react-core';

import PopoverHint from '~/components/common/PopoverHint';

export const MaxNodesTotalPopoverText = (
  <TextContent>
    <Text>
      The total number of master, infrastructure, and worker nodes of a single cluster. The maximum
      value for max-nodes-total should be the sum of:
      <List>
        <ListItem>
          <b>3 master nodes</b>
        </ListItem>
        <ListItem>
          <b>2 (single AZ) or 3 infrastructure nodes (multiple AZ)</b>
        </ListItem>
        <ListItem>
          <b>Maximum worker node count</b>, based on the cluster version:
          <List>
            <ListItem>
              <b>180</b> for clusters below Openshift v14.14.14
            </ListItem>
            <ListItem>
              <b>249</b> for clusters at or above Openshift v14.14.14
            </ListItem>
          </List>
        </ListItem>
      </List>
    </Text>
  </TextContent>
);

export const MaxNodesTotalPopover = () => (
  <PopoverHint title="Max nodes total" hint={MaxNodesTotalPopoverText} />
);
