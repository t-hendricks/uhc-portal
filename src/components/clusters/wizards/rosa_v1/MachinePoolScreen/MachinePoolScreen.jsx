import React from 'react';
import PropTypes from 'prop-types';

import { Form, Grid } from '@patternfly/react-core';

import { billingModels, normalizedProducts } from '~/common/subscriptionTypes';
import ScaleSection from '~/components/clusters/common/ScaleSection/ScaleSection';
import useCanClusterAutoscale from '~/hooks/useCanClusterAutoscale';

import MachinePoolScreenHeader from './MachinePoolScreenHeader';
import MachinePoolsSubnets from './MachinePoolsSubnets';

function MachinePoolScreen({
  isByoc,
  isMultiAz,
  machineType,
  cloudProviderID,
  product,
  autoscalingEnabled,
  autoScaleMinNodesValue,
  autoScaleMaxNodesValue,
  openEditClusterAutoScalingModal,
  change,
  billingModel,
  minNodesRequired,
  nodeIncrement,
  selectedVPC,
  clusterVersionRawId,
  imds,
  poolNumber,
  isHypershift,
  maxWorkerVolumeSizeGiB,
  hasNodeLabels,
}) {
  const canAutoScale = useCanClusterAutoscale(product, billingModel);
  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        return false;
      }}
    >
      <Grid hasGutter>
        <MachinePoolScreenHeader isHypershiftSelected={isHypershift} />

        {isHypershift && <MachinePoolsSubnets selectedVPC={selectedVPC} change={change} />}

        <ScaleSection
          isBYOC={isByoc}
          isMultiAz={isMultiAz}
          machineType={machineType}
          cloudProviderID={cloudProviderID}
          product={product}
          canAutoScale={canAutoScale}
          autoscalingEnabled={autoscalingEnabled}
          change={change}
          autoScaleMinNodesValue={autoScaleMinNodesValue}
          autoScaleMaxNodesValue={autoScaleMaxNodesValue}
          billingModel={billingModel}
          minNodesRequired={minNodesRequired}
          nodeIncrement={nodeIncrement}
          clusterVersionRawId={clusterVersionRawId}
          imds={imds}
          poolNumber={poolNumber}
          maxWorkerVolumeSizeGiB={maxWorkerVolumeSizeGiB}
          isHypershift={isHypershift}
          openEditClusterAutoScalingModal={openEditClusterAutoScalingModal}
          hasNodeLabels={hasNodeLabels}
        />
      </Grid>
    </Form>
  );
}

MachinePoolScreen.propTypes = {
  isByoc: PropTypes.bool.isRequired,
  isMultiAz: PropTypes.bool.isRequired,
  machineType: PropTypes.string.isRequired,
  cloudProviderID: PropTypes.string.isRequired,
  selectedVPC: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,
  product: PropTypes.oneOf(Object.keys(normalizedProducts)).isRequired,
  billingModel: PropTypes.oneOf(Object.values(billingModels)),
  autoscalingEnabled: PropTypes.bool,
  change: PropTypes.func.isRequired,
  autoScaleMinNodesValue: PropTypes.string,
  autoScaleMaxNodesValue: PropTypes.string,
  openEditClusterAutoScalingModal: PropTypes.func,
  minNodesRequired: PropTypes.number,
  nodeIncrement: PropTypes.number,
  clusterVersionRawId: PropTypes.string.isRequired,
  imds: PropTypes.string,
  poolNumber: PropTypes.number,
  isHypershift: PropTypes.bool,
  maxWorkerVolumeSizeGiB: PropTypes.number.isRequired,
  hasNodeLabels: PropTypes.bool,
};

export default MachinePoolScreen;
