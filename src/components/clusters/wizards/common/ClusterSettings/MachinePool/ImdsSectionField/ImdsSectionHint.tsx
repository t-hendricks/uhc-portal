import React from 'react';
import { ExternalLink } from '@openshift-assisted/ui-lib/ocm';
import { Text, TextVariants } from '@patternfly/react-core';
import links from '~/common/installLinks.mjs';
import PopoverHint from '~/components/common/PopoverHint';

export const ImdsSectionHint = () => (
  <PopoverHint
    minWidth="30rem"
    title="Amazon EC2 Instance Metadata Service (IMDS)"
    bodyContent={
      <>
        <Text component={TextVariants.p}>
          Instance metadata is data that is related to an Amazon Elastic Compute Cloud (Amazon EC2)
          instance that applications can use to configure or manage the running instance.
        </Text>
        <Text component={TextVariants.p}>
          <ExternalLink href={links.AWS_IMDS}>Learn more about IMDS</ExternalLink>
        </Text>
      </>
    }
  />
);
