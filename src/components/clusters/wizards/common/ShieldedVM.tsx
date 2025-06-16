import React from 'react';

import { FormGroup, GridItem, Split, SplitItem } from '@patternfly/react-core';

import PopoverHint from '~/components/common/PopoverHint';

import { constants } from '../../common/CreateOSDFormConstants';
import { CheckboxField } from '../form';
import { FieldId } from '../osd/constants';

type ShieldedVMProps = {
  isEditModal?: boolean;
  showSecureBootAlert?: boolean;
  secureBootAlert?: React.JSX.Element;
  isIncompatibleSecureBootVersion?: boolean;
};

export const ShieldedVM = ({
  isEditModal,
  showSecureBootAlert,
  secureBootAlert,
  isIncompatibleSecureBootVersion,
}: ShieldedVMProps) => (
  <GridItem>
    <FormGroup label="Shielded VM" fieldId={FieldId.SecureBoot}>
      <Split hasGutter className="pf-u-mb-0">
        <SplitItem>
          <CheckboxField
            name={FieldId.SecureBoot}
            label="Enable Secure Boot support for Shielded VMs"
            isDisabled={isEditModal || isIncompatibleSecureBootVersion}
          />
        </SplitItem>
        <SplitItem>
          <PopoverHint hint={constants.enableSecureBootHint} />
        </SplitItem>
      </Split>
      {showSecureBootAlert && secureBootAlert}
    </FormGroup>
  </GridItem>
);
