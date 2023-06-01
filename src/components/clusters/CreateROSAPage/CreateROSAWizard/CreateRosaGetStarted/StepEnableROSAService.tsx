import React from 'react';
import { Text, TextVariants, Title, ButtonVariant } from '@patternfly/react-core';
import links from '~/common/installLinks.mjs';
import ExternalLink from '~/components/common/ExternalLink';

const StepEnableROSAService = () => (
  <>
    <Title headingLevel="h3">Enable ROSA Service in AWS account</Title>
    <Text component={TextVariants.p}>
      ROSA needs to be enabled on your AWS account to work properly. Open the AWS Console to enable
      ROSA.
    </Text>
    <ExternalLink href={links.AWS_CONSOLE_ROSA_HOME} isButton variant={ButtonVariant.secondary}>
      Open AWS Console
    </ExternalLink>
  </>
);

export default StepEnableROSAService;
