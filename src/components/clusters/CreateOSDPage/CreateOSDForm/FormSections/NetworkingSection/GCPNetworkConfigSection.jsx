import React from 'react';

import { GridItem } from '@patternfly/react-core';
import { Field } from 'redux-form';

import { required } from '../../../../../../common/validators';
import GCPVPCName from '../../../CreateOSDWizard/NetworkScreen/GCPVPCName';
import GCPVPCSubnet from '../../../CreateOSDWizard/NetworkScreen/GCPVPCSubnet';

function GCPNetworkConfigSection() {
  return (
    <>
      <GridItem md={3}>
        <Field
          component={GCPVPCName}
          name="vpc_name"
          type="text"
          validate={required}
          label="Existing VPC name"
          placeholder="Select VPC name"
          emptyPlaceholder="No existing VPCs"
        />
      </GridItem>
      <GridItem md={3}>
        <Field
          component={GCPVPCSubnet}
          name="control_plane_subnet"
          type="text"
          validate={required}
          label="Control plane subnet name"
          placeholder="Select subnet name"
          emptyPlaceholder="No subnet names"
        />
      </GridItem>
      <GridItem md={3}>
        <Field
          component={GCPVPCSubnet}
          name="compute_subnet"
          type="text"
          validate={required}
          label="Compute subnet name"
          placeholder="Select subnet name"
          emptyPlaceholder="No subnet names"
        />
      </GridItem>
    </>
  );
}

GCPNetworkConfigSection.propTypes = {};

export default GCPNetworkConfigSection;
