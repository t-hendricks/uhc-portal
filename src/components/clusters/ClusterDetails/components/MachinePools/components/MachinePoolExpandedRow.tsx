import React from 'react';
import { Label, Title, Grid, GridItem } from '@patternfly/react-core';
import isEmpty from 'lodash/isEmpty';

import { MachinePool } from '~/types/clusters_mgmt.v1/models/MachinePool';
import { Cluster, SecurityGroup } from '~/types/clusters_mgmt.v1';
import { useAWSVPCFromCluster } from '~/components/clusters/CreateOSDPage/CreateOSDWizard/NetworkScreen/useAWSVPCFromCluster';
import { hasSubnets, getSubnetIds } from '../machinePoolsHelper';
import MachinePoolAutoScalingDetail from '../MachinePoolAutoscalingDetail';

const taintsRenderer = (taints: MachinePool['taints']) =>
  (taints || []).map((taint) => `${taint.key} = ${taint.value}:${taint.effect}`);

const labelsRenderer = (labels: Record<string, string>) =>
  Object.keys(labels || {}).map((labelKey) => {
    const value = labels[labelKey] || '';
    return `${labelKey}${value ? ' = ' : ''}${value}`;
  });

const securityGroupsRenderer = (securityGroupIds: string[], securityGroups: SecurityGroup[]) =>
  securityGroupIds.map((sgId) => {
    const securityGroupName = securityGroups.find((sg) => sg.id === sgId)?.name;
    return securityGroupName || sgId; // Name of a SecurityGroup is optional
  });

const MachinePoolItemList = ({ title, items }: { title: string; items: string[] }) => (
  <>
    <Title headingLevel="h4">{title}</Title>
    {items.map((item, index) => (
      <Label
        color="blue"
        // eslint-disable-next-line react/no-array-index-key
        key={`${title}-${index}`}
        className="pf-c-label--break-word pf-u-m-sm pf-u-ml-0"
      >
        {item}
      </Label>
    ))}
  </>
);

const MachinePoolExpandedRow = ({
  cluster,
  isMultiZoneCluster,
  machinePool,
}: {
  cluster: Cluster;
  isMultiZoneCluster: boolean;
  machinePool: MachinePool;
}) => {
  const spotMarketOptions = machinePool?.aws?.spot_market_options;

  const { clusterVpc } = useAWSVPCFromCluster(cluster);
  const securityGroupIds = machinePool.aws?.additional_security_group_ids || [];

  return (
    <Grid hasGutter>
      {!isEmpty(machinePool.labels) && (
        <GridItem md={6}>
          <MachinePoolItemList title="Labels" items={labelsRenderer(machinePool.labels || {})} />
        </GridItem>
      )}
      {machinePool.taints && (
        <GridItem md={6}>
          <MachinePoolItemList title="Taints" items={taintsRenderer(machinePool.taints)} />
        </GridItem>
      )}
      {securityGroupIds.length > 0 && (
        <GridItem md={6}>
          <MachinePoolItemList
            title="Security groups"
            items={securityGroupsRenderer(securityGroupIds, clusterVpc?.aws_security_groups || [])}
          />
        </GridItem>
      )}
      {hasSubnets(machinePool) && (
        <GridItem md={6}>
          <MachinePoolItemList title="Subnets" items={getSubnetIds(machinePool)} />
        </GridItem>
      )}
      {machinePool.autoscaling && (
        <GridItem md={6}>
          <MachinePoolAutoScalingDetail
            isMultiZoneCluster={isMultiZoneCluster}
            autoscaling={machinePool.autoscaling}
          />
        </GridItem>
      )}
      {spotMarketOptions && (
        <GridItem md={6}>
          <Title headingLevel="h4">Spot instance pricing</Title>
          {spotMarketOptions.max_price
            ? `Maximum hourly price: ${spotMarketOptions.max_price}`
            : 'On-Demand'}
        </GridItem>
      )}
    </Grid>
  );
};

export default MachinePoolExpandedRow;
