import React from 'react';
import { Flex, FlexItem, Title } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { TechnologyPreview } from '@openshift-assisted/ui-lib/ocm';

const HibernateClusterModalTitle = ({ title }: { title: string }) => (
  <Flex alignItems={{ default: 'alignItemsCenter' }}>
    <FlexItem>
      <InfoCircleIcon className="info" size="md" />
    </FlexItem>
    <FlexItem>
      <Title headingLevel="h2">{title}</Title>
    </FlexItem>
    <FlexItem>
      <TechnologyPreview className="pf-u-ml-0" />
    </FlexItem>
  </Flex>
);

export default HibernateClusterModalTitle;
