import React from 'react';

import {
  GridItem,
} from '@patternfly/react-core';
import { Field } from 'redux-form';
import ReduxVerticalFormGroup from '../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';

import { validateGCPSubnet } from '../../../../../../common/validators';

function GCPNetworkConfigSection() {
  return (
    <>
      <GridItem sm={12} md={3}>
        <Field
          component={ReduxVerticalFormGroup}
          name="vpc_name"
          type="text"
          validate={validateGCPSubnet}
          label="Existing VPC name"
          placeholder="VPC Name"
        />
      </GridItem>
      <GridItem sm={12} md={3}>
        <Field
          component={ReduxVerticalFormGroup}
          name="control_plane_subnet"
          type="text"
          validate={validateGCPSubnet}
          label="Control plane subnet name"
          placeholder="Subnet name"
        />
      </GridItem>
      <GridItem sm={12} md={3}>
        <Field
          component={ReduxVerticalFormGroup}
          name="compute_subnet"
          type="text"
          validate={validateGCPSubnet}
          label="Compute Subnet name"
          placeholder="Subnet name"
        />
      </GridItem>
    </>
  );
}

export default GCPNetworkConfigSection;
