import React from 'react';
import { Label, Title, Flex, FlexItem } from '@patternfly/react-core';
import isEmpty from 'lodash/isEmpty';
import chunk from 'lodash/chunk';

import { MachinePool } from '~/types/clusters_mgmt.v1/models/MachinePool';
import { Taint } from '~/types/clusters_mgmt.v1/models/Taint';
import { hasSubnets, getSubnetIds } from '../machinePoolsHelper';
import MachinePoolAutoScalingDetail from '../MachinePoolAutoscalingDetail';

const ExpandableRow = ({
  isMultiZoneCluster,
  machinePool,
}: {
  isMultiZoneCluster: boolean;
  machinePool: MachinePool;
}) => {
  let labels = null;
  let taints = null;
  let autoscaling = null;
  let subnets = null;
  let spotInstance = null;

  if (machinePool.labels) {
    const { labels: labelsData } = machinePool;
    const labelsKeys = !isEmpty(labelsData) ? Object.keys(labelsData) : [];
    if (labelsKeys.length > 0) {
      labels = (
        <>
          <Title headingLevel="h4">Labels</Title>
          {labelsKeys.map((key) => (
            <React.Fragment key={`label-${key}`}>
              <Label color="blue">{`${[key]} ${labelsData[key] ? '=' : ''} ${
                labelsData[key]
              }`}</Label>{' '}
            </React.Fragment>
          ))}
        </>
      );
    }
  }

  if (machinePool.taints) {
    const { taints: taintsData } = machinePool;
    taints = (
      <>
        <Title headingLevel="h4">Taints</Title>
        {taintsData?.map((taint: Taint) => (
          <React.Fragment key={`taint-${taint.key}`}>
            <Label color="blue" className="pf-c-label--break-word">
              {`${taint.key} = ${taint.value}:${taint.effect}`}
            </Label>{' '}
          </React.Fragment>
        ))}
      </>
    );
  }

  if (machinePool.autoscaling) {
    autoscaling = (
      <MachinePoolAutoScalingDetail
        isMultiZoneCluster={isMultiZoneCluster}
        autoscaling={machinePool.autoscaling}
      />
    );
  }

  const awsSpotInstance = machinePool?.aws?.spot_market_options;
  if (awsSpotInstance) {
    const awsPrice = awsSpotInstance?.max_price
      ? `Maximum hourly price: ${awsSpotInstance?.max_price}`
      : 'On-Demand';
    spotInstance = (
      <>
        <Title headingLevel="h4">Spot instance pricing</Title>
        {awsPrice}
      </>
    );
  }

  if (hasSubnets(machinePool)) {
    subnets = (
      <>
        <Title headingLevel="h4">Subnets</Title>
        {getSubnetIds(machinePool).join(', ')}
      </>
    );
  }

  const sections = [labels, taints, autoscaling, spotInstance, subnets].filter(
    (section) => section !== null,
  );
  const columns = chunk(sections, 3);

  return (
    <>
      <Flex>
        {columns.map((column) => (
          <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsXl' }}>
            {column.map((section) => (
              <FlexItem>{section}</FlexItem>
            ))}
          </Flex>
        ))}
      </Flex>
    </>
  );
};

export default ExpandableRow;
