import { Text, TextVariants } from '@patternfly/react-core';
import React from 'react';
import PopoverHint from '~/components/common/PopoverHint';

export const ImdsSectionHint = ({ isImdsDisabled }: { isImdsDisabled: boolean }) => (
  <PopoverHint
    minWidth="30rem"
    title="Amazon EC2 Instance Metadata Service (IMDS)"
    bodyContent={
      <>
        <Text component={TextVariants.p}>
          Instance metadata is data that is related to an Amazon Elastic Compute Cloud (Amazon EC2)
          instance that applications can use to configure or manage the running instance.
        </Text>
        {isImdsDisabled && (
          <Text component={TextVariants.p}>
            <b>In order to enable Instance Metadata Service options</b>, in the previous step you
            must select a cluster version greater or equal to 4.11.
          </Text>
        )}
      </>
    }
  />
);
