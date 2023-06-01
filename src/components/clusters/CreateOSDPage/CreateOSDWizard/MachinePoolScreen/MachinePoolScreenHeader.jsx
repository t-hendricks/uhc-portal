import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, Text, Title } from '@patternfly/react-core';

function HypershiftMachinePoolHeader() {
  return (
    <Grid>
      <GridItem>
        <Title headingLevel="h3">Machine pools</Title>
      </GridItem>
      <GridItem>
        <Text component="p">
          Create machine pools and specify the private subnet ID for each machine pool. To make your
          cluster highly available, add machine pools on different availability zones. Additional
          machine pools can be created after cluster creation.
        </Text>
      </GridItem>
    </Grid>
  );
}

function DefaultMachinePoolHeader() {
  return (
    <Grid>
      <GridItem>
        <Title headingLevel="h3">Default machine pool</Title>
      </GridItem>
      <GridItem>
        <Text component="p">
          Select a compute node instance type and count for your default machine pool.
        </Text>
        <Text component="p">
          After cluster creation, your selected default machine pool instance type is permanent.
        </Text>
      </GridItem>
    </Grid>
  );
}

function MachinePoolScreenHeader({ isHypershiftSelected }) {
  if (isHypershiftSelected) {
    return <HypershiftMachinePoolHeader />;
  }
  return <DefaultMachinePoolHeader />;
}

MachinePoolScreenHeader.propTypes = {
  isHypershiftSelected: PropTypes.bool.isRequired,
};

export default MachinePoolScreenHeader;
