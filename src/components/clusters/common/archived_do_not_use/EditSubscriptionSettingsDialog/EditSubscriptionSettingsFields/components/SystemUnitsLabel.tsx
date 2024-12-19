import React from 'react';

import { Text, TextContent, TextVariants } from '@patternfly/react-core';

import PopoverHint from '~/components/common/PopoverHint';

import { LABEL_ICON_CLASS } from '../constants';

const SystemUnitsLabel = () => (
  <>
    <span>Subscription units</span>
    <PopoverHint
      id="subscripiton-settings-system-units-hint"
      headerContent="Subscription units"
      hint={
        <TextContent>
          <Text component={TextVariants.p}>How usage is measured for your subscription.</Text>
        </TextContent>
      }
      iconClassName={LABEL_ICON_CLASS}
    />
  </>
);

export default SystemUnitsLabel;
