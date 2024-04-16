import React from 'react';

import { Bullseye, Flex, FlexItem, Icon, Spinner, Title } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons/dist/esm/icons/info-circle-icon';
import { ScalprumComponent } from '@scalprum/react-core';

const props = {
  appName: 'assisted-installer-app',
  className: 'pf-u-ml-0',
};

const HibernateClusterModalTitle = ({ title }: { title: string }) => (
  <Flex alignItems={{ default: 'alignItemsCenter' }}>
    <FlexItem>
      <Icon size="md">
        <InfoCircleIcon className="info" />
      </Icon>
    </FlexItem>
    <FlexItem>
      <Title headingLevel="h2">{title}</Title>
    </FlexItem>
    <FlexItem>
      <ScalprumComponent
        {...props}
        scope="assistedInstallerApp"
        module="./TechnologyPreview"
        fallback={
          <Bullseye>
            <Spinner />
          </Bullseye>
        }
      />
    </FlexItem>
  </Flex>
);

export default HibernateClusterModalTitle;
