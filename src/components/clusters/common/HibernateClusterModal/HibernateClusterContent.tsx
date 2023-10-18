import React from 'react';
import { List, ListItem, Text, TextContent } from '@patternfly/react-core';

import ExternalLink from '~/components/common/ExternalLink';
import links from '~/common/installLinks.mjs';

const HibernateInfoLink = () => (
  <ExternalLink href={links.HIBERNATING_CLUSTER}>Learn more about cluster hibernation</ExternalLink>
);

const HibernateClusterContent = ({
  clusterName,
  isHibernating,
}: {
  clusterName: string;
  isHibernating: boolean;
}) => (
  <>
    {isHibernating ? (
      <TextContent>
        <Text>
          Cluster <strong>{clusterName}</strong> will move out of Hibernating state and all cluster
          operations will be resumed.
        </Text>
        <HibernateInfoLink />
      </TextContent>
    ) : (
      <>
        <List>
          <ListItem>
            Hibernating clusters is not fully supported under Red Hat Subscription Level Agreements,
            might not be functionally complete, and is not intended for production use.
          </ListItem>
          <ListItem>
            It&apos;s recommended to hibernate only clusters that run recoverable workloads.
          </ListItem>
        </List>
        <HibernateInfoLink />
        <TextContent>
          <Text>
            Are you sure you want to hibernate <strong>{clusterName}</strong>?
          </Text>
        </TextContent>
      </>
    )}
  </>
);

export default HibernateClusterContent;
