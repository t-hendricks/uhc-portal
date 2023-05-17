import { ExternalLink } from '@openshift-assisted/ui-lib/ocm';
import { Text, TextVariants } from '@patternfly/react-core';
import React from 'react';
import links from '~/common/installLinks.mjs';
import PopoverHint from '~/components/common/PopoverHint';

export const ImdsSectionHint = ({ isImdsDisabled }: { isImdsDisabled: boolean }) => (
  <PopoverHint
    minWidth="30rem"
    title="Amazon EC2 Instance Metadata Service (IMDS)"
    bodyContent={
      <>
        {isImdsDisabled && (
          <Text component={TextVariants.p}>
            <b>In order to enable Instance Metadata Service options</b>, in the previous step you
            must select a cluster version greater or equal to 4.11.
          </Text>
        )}
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
