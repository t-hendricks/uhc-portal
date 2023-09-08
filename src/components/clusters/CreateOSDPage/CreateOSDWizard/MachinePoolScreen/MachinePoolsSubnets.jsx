import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem } from '@patternfly/react-core';
import { Field, FieldArray } from 'redux-form';

import ReduxFormMachinePoolSubnets from '~/components/common/ReduxFormComponents/ReduxFormMachinePoolSubnets/ReduxFormMachinePoolSubnets';
import VPCDropdown from './VPCDropdown';

const subnetWarnings = (value, allValues) => {
  const enteredSubnets = allValues.machine_pools_subnets.filter((subnet) => !!subnet.subnet_id);
  const azs = enteredSubnets.map((subnet) => subnet.availability_zone);
  const subnetIds = enteredSubnets.map((subnet) => subnet.subnet_id);
  const allSubnetsInSameAz = new Set(subnetIds).size > 1 && new Set(azs).size === 1;
  return allSubnetsInSameAz
    ? `Your cluster will not be highly available because all the subnets are in the same availability zone (${azs[0]}). To improve security and uptime, it's recommended to select subnets from different availability zones`
    : undefined;
};

function MachinePoolsSubnets({ selectedVPC }) {
  return (
    <Grid hasGutter>
      <GridItem span={6}>
        <Field
          component={VPCDropdown}
          name="selected_vpc"
          validate={(value) => (value?.id.length > 0 ? undefined : 'error')}
          selectedVPC={selectedVPC}
          showRefresh
        />
      </GridItem>
      {selectedVPC?.id && (
        <FieldArray
          name="machine_pools_subnets"
          component={ReduxFormMachinePoolSubnets}
          selectedVPCID={selectedVPC.id}
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
