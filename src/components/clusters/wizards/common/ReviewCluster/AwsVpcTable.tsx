import React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';

import { CloudVPC } from '~/types/clusters_mgmt.v1';

const getSubnetName = (vpc: CloudVPC, subnetId: string) => {
  const subnetInfo = vpc.aws_subnets?.find((subnet) => subnet.subnet_id === subnetId);
  return subnetInfo?.name || subnetId;
};

interface AwsVpcTableProps {
  vpc: CloudVPC;
  hasPublicSubnets: boolean;
  machinePoolsSubnets: {
    availabilityZone: string;
    privateSubnetId: string;
    publicSubnetId: string;
  }[];
}

const AwsVpcTable = ({ vpc, machinePoolsSubnets, hasPublicSubnets }: AwsVpcTableProps) => {
  const colSize = hasPublicSubnets ? 3 : 6;

  return (
    <Grid>
      <GridItem md={colSize}>
        <strong>Availability zone</strong>
      </GridItem>
      <GridItem md={colSize}>
        <strong>Private subnet</strong>
      </GridItem>
      {hasPublicSubnets && (
        <>
          <GridItem md={colSize}>
            <strong>Public subnet</strong>
          </GridItem>
          <GridItem md={colSize} />
        </>
      )}
      {machinePoolsSubnets.map((mpSubnet) => (
        <React.Fragment key={mpSubnet.privateSubnetId}>
          <GridItem md={colSize}>{mpSubnet.availabilityZone}</GridItem>
          <GridItem md={colSize}>{getSubnetName(vpc, mpSubnet.privateSubnetId)}</GridItem>
          {hasPublicSubnets && (
            <>
              <GridItem md={colSize}>{getSubnetName(vpc, mpSubnet.publicSubnetId)}</GridItem>
              <GridItem md={colSize} />
            </>
          )}
        </React.Fragment>
      ))}
    </Grid>
  );
};

export default AwsVpcTable;
