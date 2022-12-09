import React from 'react';
import { Text, TextVariants, Title, Alert, Flex, FlexItem } from '@patternfly/react-core';

import ExternalLink from '~/components/common/ExternalLink';
import DownloadAndOSSelection from '~/components/clusters/install/instructions/components/DownloadAndOSSelection';
import links, { tools, channels } from '~/common/installLinks.mjs';

const StepDownloadROSACli = () => (
  <>
    <Title headingLevel="h3">
      Download and install the ROSA and AWS command line tools (CLI) and add it to your{' '}
      <code>PATH</code>.
    </Title>

    <Flex>
      <FlexItem className="pf-u-mb-md">
        <DownloadAndOSSelection tool={tools.ROSA} channel={channels.STABLE} />
      </FlexItem>
      <FlexItem>
        <ExternalLink href={links.ROSA_CLI_DOCS}>Help with ROSA CLI setup</ExternalLink>
      </FlexItem>
    </Flex>

    <Text component={TextVariants.p}>
      <ExternalLink href={links.AWS_CLI}>Instructions to install the AWS CLI</ExternalLink>
    </Text>
    {/* TODO: PatternFly incorrectly puts the content of an alert as a h4 - this text should not be a heading */}
    <Alert
      variant="info"
      isInline
      isPlain
      title="If you have AWS CLI already installed, you can skip downloading."
    />
  </>
);

export default StepDownloadROSACli;
