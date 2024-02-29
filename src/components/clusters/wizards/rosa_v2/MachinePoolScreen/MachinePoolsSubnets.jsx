import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem } from '@patternfly/react-core';
import { Field, FieldArray } from 'redux-form';

import ReduxFormMachinePoolSubnets from '~/components/common/ReduxFormComponents/ReduxFormMachinePoolSubnets/ReduxFormMachinePoolSubnets';
import VPCDropdown from '../../common/VPCDropdown/VPCDropdown';

const subnetWarnings = (value, allValues) => {
  const privateSubnetIds = allValues.machinePoolsSubnets
    .map((subnet) => subnet.privateSubnetId)
    .filter((id) => !!id);
  const AZs = (allValues.selected_vpc.aws_subnets || [])
    .filter((vpcSubnet) => privateSubnetIds.includes(vpcSubnet.subnet_id))
    .map((vpcSubnet) => vpcSubnet.availability_zone);
  const allSubnetsInSameAz = new Set(privateSubnetIds).size > 1 && new Set(AZs).size === 1;

  return allSubnetsInSameAz
    ? `Your cluster will not be highly available because all the subnets are in the same availability zone (${AZs[0]}). To improve security and uptime, it's recommended to select subnets from different availability zones`
    : undefined;
};

/**
 * Machine Pools Subnets specific to Hypershift:
 * Up to 3 MP can be added, with one private subnet per MP
 * Additionally, if users select "Public" privacy, they will later have to select a public subnet
 *
 * @param selectedVPC vpc details
 * @returns {Element}
 */
function MachinePoolsSubnets({ selectedVPC }) {
  return (
    <Grid hasGutter>
      <GridItem span={6}>
        <Field
          component={VPCDropdown}
          name="selected_vpc"
          validate={(newVPC) => (newVPC?.id ? undefined : 'error')}
          selectedVPC={selectedVPC}
          showRefresh
          isHypershift
        />
      </GridItem>
      {(selectedVPC?.id || selectedVPC?.name) && (
        <FieldArray
          name="machinePoolsSubnets"
          component={ReduxFormMachinePoolSubnets}
          selectedVPC={selectedVPC}
          warn={subnetWarnings}
        />
      )}
    </Grid>
  );
}

MachinePoolsSubnets.propTypes = {
  selectedVPC: PropTypes.object,
};

export default MachinePoolsSubnets;
