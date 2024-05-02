import React from 'react';

import { Grid, GridItem, Text, Title } from '@patternfly/react-core';

const HypershiftMachinePoolHeader = () => (
  <Grid>
    <GridItem>
      <Title headingLevel="h3">Machine pools</Title>
    </GridItem>
    <GridItem>
      <Text component="p">
        Create machine pools and specify the private subnet for each machine pool. To make your
        cluster highly available, add machine pools on different availability zones. Additional
        machine pools can be created after cluster creation.
      </Text>
    </GridItem>
  </Grid>
);

const DefaultMachinePoolHeader = () => (
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

type MachinePoolScreenHeaderProps = {
  isHypershiftSelected: boolean;
};

const MachinePoolScreenHeader = ({ isHypershiftSelected }: MachinePoolScreenHeaderProps) =>
  isHypershiftSelected ? <HypershiftMachinePoolHeader /> : <DefaultMachinePoolHeader />;

export default MachinePoolScreenHeader;
