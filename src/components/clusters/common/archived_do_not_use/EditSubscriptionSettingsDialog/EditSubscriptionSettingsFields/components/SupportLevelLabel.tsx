import React from 'react';

import { Text, TextContent, TextVariants } from '@patternfly/react-core';

import ExternalLink from '~/components/common/ExternalLink';
import PopoverHint from '~/components/common/PopoverHint';

import { LABEL_ICON_CLASS } from '../constants';

const SupportLevelLabel = () => (
  <>
    <span>Service level agreement (SLA)</span>
    <PopoverHint
      id="subscripiton-settings-support-level-hint"
      headerContent="Service level agreement (SLA)"
      hint={
        <TextContent>
          <Text component={TextVariants.p}>
            How your subscription is supported, including the hours of support coverage and support
            ticket response times.
          </Text>
          <Text component={TextVariants.p}>
            <ExternalLink href="https://access.redhat.com/support/">
              Production Support Terms of Service
            </ExternalLink>
          </Text>
        </TextContent>
      }
      iconClassName={LABEL_ICON_CLASS}
      hasAutoWidth
      maxWidth="30.0rem"
    />
  </>
);
export default SupportLevelLabel;
