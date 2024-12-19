import React from 'react';

import { Text, TextContent, TextVariants } from '@patternfly/react-core';

import PopoverHint from '~/components/common/PopoverHint';

import { LABEL_ICON_CLASS } from '../constants';

const ServiceLevelLabel = () => (
  <>
    <span>Support type</span>
    <PopoverHint
      id="subscripiton-settings-service-level-hit"
      headerContent="Support type"
      hint={
        <TextContent>
          <Text component={TextVariants.p}>Who you can call for primary support.</Text>
        </TextContent>
      }
      iconClassName={LABEL_ICON_CLASS}
    />
  </>
);
export default ServiceLevelLabel;
