import React from 'react';

import { Text, TextContent, TextVariants } from '@patternfly/react-core';

import PopoverHint from '~/components/common/PopoverHint';

import { LABEL_ICON_CLASS } from '../constants';

const UsageLabel = () => (
  <>
    <span>Cluster usage</span>
    <PopoverHint
      id="subscripiton-settings-usage-hint"
      headerContent="Cluster usage"
      hint={
        <TextContent>
          <Text component={TextVariants.p}>How you are using this cluster.</Text>
        </TextContent>
      }
      iconClassName={LABEL_ICON_CLASS}
    />
  </>
);

export default UsageLabel;
