import React from 'react';

import { Text, TextContent, TextList, TextListItem, TextVariants } from '@patternfly/react-core';

import links, { channels, tools } from '~/common/installLinks.mjs';
import DownloadAndOSSelection from '~/components/clusters/install/instructions/components/DownloadAndOSSelection';
import ExternalLink from '~/components/common/ExternalLink';

const StepDownloadROSACli = () => (
  <TextContent>
    <Text component="h3">
      Download and install the ROSA and AWS command line tools (CLI) and add it to your{' '}
      <code>PATH</code>.
    </Text>
    <TextList component="ol">
      <TextListItem className="pf-v5-u-mb-lg">
        <Text component={TextVariants.p}>Download the latest version of the ROSA CLI</Text>
        <Text component={TextVariants.p} className="pf-v5-u-mt-md">
          <DownloadAndOSSelection tool={tools.ROSA} channel={channels.STABLE} />
        </Text>
        <Text component="p">
          <ExternalLink href={links.ROSA_CLI_DOCS}>Help with ROSA CLI setup</ExternalLink>
        </Text>
      </TextListItem>
      <TextListItem>
        <Text component={TextVariants.p}>Download the AWS CLI version 2</Text>
        <Text component={TextVariants.p} className="pf-v5-u-mt-md">
          <ExternalLink href={links.AWS_CLI}>Instructions to install the AWS CLI</ExternalLink>
        </Text>
      </TextListItem>
    </TextList>
  </TextContent>
);

export default StepDownloadROSACli;
