import React from 'react';
import { Label, Title, Split, SplitItem } from '@patternfly/react-core';
import cx from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { MachinePool } from '~/types/clusters_mgmt.v1/models/MachinePool';
import { ClusterFromSubscription } from '~/types/types';
import { Taint } from '~/types/clusters_mgmt.v1/models/Taint';
import { getSubnetIds } from '../machinePoolsHelper';
import { isMultiAZ } from '../../../clusterDetailsHelper';

const ExpandableRow = ({
  cluster,
  machinePool,
}: {
  cluster: ClusterFromSubscription;
  machinePool: MachinePool;
}) => {
  let labelsList = null;
  let taintsList = null;

  if (machinePool.labels) {
    const { labels } = machinePool;
    const labelsKeys = !isEmpty(labels) ? Object.keys(labels) : [];

    labelsList = labelsKeys.length
      ? labelsKeys.map((key) => (
          <React.Fragment key={`label-${key}`}>
            <Label color="blue">{`${[key]} ${labels[key] ? '=' : ''} ${labels[key]}`}</Label>{' '}
          </React.Fragment>
        ))
      : null;
  }

  if (machinePool.taints) {
    const { taints } = machinePool;
    taintsList = taints?.map((taint: Taint) => (
      <React.Fragment key={`taint-${taint.key}`}>
        <Label color="blue" className="pf-c-label--break-word">
          {`${taint.key} = ${taint.value}:${taint.effect}`}
        </Label>{' '}
      </React.Fragment>
    ));
  }

  const autoScaling = machinePool.autoscaling && (
    <>
      <Title headingLevel="h4" className="pf-u-mb-sm pf-u-mt-lg">
        Autoscaling
      </Title>
      <Split hasGutter>
        <SplitItem>
          <Title headingLevel="h4" className="autoscale__lim">{`Min nodes ${
            isMultiAZ(cluster) ? 'per zone' : ''
          }`}</Title>
          {machinePool.autoscaling.min_replicas &&
            (isMultiAZ(cluster)
              ? machinePool.autoscaling.min_replicas / 3
              : machinePool.autoscaling.min_replicas)}
        </SplitItem>
        <SplitItem>
          <Title headingLevel="h4" className="autoscale__lim">{`Max nodes ${
            isMultiAZ(cluster) ? 'per zone' : ''
          }`}</Title>
          {machinePool.autoscaling.max_replicas &&
            (isMultiAZ(cluster)
              ? machinePool.autoscaling.max_replicas / 3
              : machinePool.autoscaling.max_replicas)}
        </SplitItem>
      </Split>
    </>
  );

  const awsSpotInstance = machinePool?.aws?.spot_market_options;
  const awsPrice = awsSpotInstance?.max_price
    ? `Maximum hourly price: ${awsSpotInstance?.max_price}`
    : 'On-Demand';

  const subnets = (
    <>
      <Title headingLevel="h4" className="pf-u-mb-sm">
        Subnets
      </Title>
      {getSubnetIds(machinePool).map((subnetId, idx) => (
        <div key={`subnet-${subnetId || idx}`}>{subnetId}</div>
      ))}
      {/* <div key="subnet-1">subnet-1</div>
          <div key="subnet-1">subnet-2</div>
          <div key="subnet-1">subnet-3</div> */}
    </>
  );

  return (
    <>
      {labelsList && (
        <>
          <Title headingLevel="h4" className="pf-u-mb-sm">
            Labels
          </Title>
          {labelsList}
        </>
      )}
      {taintsList && (
        <>
          <Title headingLevel="h4" className={cx('pf-u-mb-sm', labelsList && 'pf-u-mt-lg')}>
            Taints
          </Title>
          {taintsList}
        </>
      )}
      {autoScaling}
      {awsSpotInstance && (
        <>
          <Title headingLevel="h4" className={cx('pf-u-mb-sm', labelsList && 'pf-u-mt-lg')}>
            Spot instance pricing
          </Title>
          {awsPrice}
        </>
      )}
      {subnets}
    </>
  );
};

export default ExpandableRow;
