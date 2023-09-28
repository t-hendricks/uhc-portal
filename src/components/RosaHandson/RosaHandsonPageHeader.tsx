import React from 'react';

import {
  Flex,
  FlexItem,
  Divider,
  Stack,
  StackItem,
  Text,
  TextContent,
} from '@patternfly/react-core';
import { PageHeader } from '@redhat-cloud-services/frontend-components';

import ExternalLink from '../common/ExternalLink';
import OpenshiftIcon from './RosaHandsonIcons/OpenshiftIcon';
import RosaHandsOnLinks from './RosaHandsOnLinks';

const RosaHandsonPageHeader = () => (
  <PageHeader>
    <Flex direction={{ default: 'row' }} flexWrap={{ default: 'nowrap' }}>
      <FlexItem alignSelf={{ default: 'alignSelfFlexStart' }}>
        <OpenshiftIcon />
      </FlexItem>
      <Divider orientation={{ default: 'vertical' }} />
      <FlexItem>
        <Stack hasGutter>
          <StackItem>
            <TextContent>
              <Text component="h2">Red Hat OpenShift on AWS Hands-on Experience</Text>
            </TextContent>
          </StackItem>
          <StackItem>
            <Text>
              Red Hat OpenShift Service on AWS is a fully managed turnkey application platform that
              allows organizations to quickly build, deploy, and scale applications in a native AWS
              environment. With one click, start your free 8-hour hands-on experience in a ROSA
              cluster.
            </Text>
          </StackItem>
          <StackItem>
            <ExternalLink href={RosaHandsOnLinks.slackChannel}>
              Have a question? Join our slack community
            </ExternalLink>
          </StackItem>
        </Stack>
      </FlexItem>
    </Flex>
  </PageHeader>
);

export default RosaHandsonPageHeader;
