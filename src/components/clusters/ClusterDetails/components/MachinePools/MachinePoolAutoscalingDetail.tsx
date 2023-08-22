import React from 'react';
import { Split, SplitItem, Title } from '@patternfly/react-core';
import { MachinePoolAutoscaling } from '~/types/clusters_mgmt.v1';

const getReplicas = (replicas: number | undefined, isMultiZone: boolean) => {
  if (replicas === undefined) {
    return 0;
  }
  return isMultiZone ? replicas / 3 : replicas;
};

const MachinePoolAutoScalingDetail = ({
  isMultiZoneCluster,
  autoscaling,
}: {
  isMultiZoneCluster: boolean;
  autoscaling: MachinePoolAutoscaling;
}) => (
  <>
    <Title headingLevel="h4" className="pf-u-mb-sm pf-u-mt-lg">
      Autoscaling
    </Title>
    <Split hasGutter>
      <SplitItem>
        <Title headingLevel="h4" className="autoscale__lim">{`Min nodes ${
          isMultiZoneCluster ? 'per zone' : ''
        }`}</Title>
        {getReplicas(autoscaling.min_replicas, isMultiZoneCluster)}
      </SplitItem>
      <SplitItem>
        <Title headingLevel="h4" className="autoscale__lim">{`Max nodes ${
          isMultiZoneCluster ? 'per zone' : ''
        }`}</Title>
        {getReplicas(autoscaling.max_replicas, isMultiZoneCluster)}
      </SplitItem>
    </Split>
  </>
);

export default MachinePoolAutoScalingDetail;
