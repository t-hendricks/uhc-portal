import React from 'react';
import PropTypes from 'prop-types';

import { GridItem } from '@patternfly/react-core';
import { Field } from 'redux-form';

import ReduxVerticalFormGroup from '../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import { required, validateGCPSubnet } from '../../../../../../common/validators';
import GCPVPCName from '../../../CreateOSDWizard/NetworkScreen/GCPVPCName';
import GCPVPCSubnet from '../../../CreateOSDWizard/NetworkScreen/GCPVPCSubnet';

function GCPNetworkConfigSection({ isWizard }) {
  return (
    <>
      <GridItem md={3}>
        <Field
          component={isWizard ? GCPVPCName : ReduxVerticalFormGroup}
          name="vpc_name"
          type="text"
          validate={isWizard ? required : validateGCPSubnet}
          label="Existing VPC name"
          placeholder={isWizard ? 'Select VPC name' : 'VPC name'}
          emptyPlaceholder="No existing VPCs"
        />
      </GridItem>
      <GridItem md={3}>
        <Field
          component={isWizard ? GCPVPCSubnet : ReduxVerticalFormGroup}
          name="control_plane_subnet"
          type="text"
          validate={isWizard ? required : validateGCPSubnet}
          label="Control plane subnet name"
          placeholder={isWizard ? 'Select subnet name' : 'Subnet name'}
          emptyPlaceholder="No subnet names"
        />
      </GridItem>
      <GridItem md={3}>
        <Field
          component={isWizard ? GCPVPCSubnet : ReduxVerticalFormGroup}
          name="compute_subnet"
          type="text"
          validate={isWizard ? required : validateGCPSubnet}
          label="Compute subnet name"
          placeholder={isWizard ? 'Select subnet name' : 'Subnet name'}
          emptyPlaceholder="No subnet names"
        />
      </GridItem>
    </>
  );
}

GCPNetworkConfigSection.propTypes = {
  isWizard: PropTypes.bool,
};

export default GCPNetworkConfigSection;
