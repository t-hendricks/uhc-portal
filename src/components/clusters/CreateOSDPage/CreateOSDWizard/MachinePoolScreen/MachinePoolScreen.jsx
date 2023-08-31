import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Form } from '@patternfly/react-core';

import { normalizedProducts, billingModels } from '~/common/subscriptionTypes';

import ScaleSection from '../../CreateOSDForm/FormSections/ScaleSection/ScaleSection';
import MachinePoolScreenHeader from './MachinePoolScreenHeader';
import MachinePoolsSubnets from './MachinePoolsSubnets';

function MachinePoolScreen({
  isByoc,
  isMultiAz,
  machineType,
  cloudProviderID,
  product,
  canAutoScale,
  autoscalingEnabled,
  autoScaleMinNodesValue,
  autoScaleMaxNodesValue,
  change,
  billingModel,
  minNodesRequired,
  nodeIncrement,
  selectedVPCID,
  clusterVersionRawId,
  imds,
  poolNumber,
  isHypershift,
  maxWorkerVolumeSizeGiB,
}) {
  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        return false;
      }}
    >
      <Grid hasGutter>
        <MachinePoolScreenHeader isHypershiftSelected={isHypershift} />

        {isHypershift && <MachinePoolsSubnets selectedVPCID={selectedVPCID} />}

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
          showStorageAndLoadBalancers={false}
          minNodesRequired={minNodesRequired}
          nodeIncrement={nodeIncrement}
          clusterVersionRawId={clusterVersionRawId}
          imds={imds}
          poolNumber={poolNumber}
          maxWorkerVolumeSizeGiB={maxWorkerVolumeSizeGiB}
          isHypershift={isHypershift}
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
  selectedVPCID: PropTypes.string.isRequired,
  product: PropTypes.oneOf(Object.keys(normalizedProducts)).isRequired,
  billingModel: PropTypes.oneOf(Object.values(billingModels)),
  canAutoScale: PropTypes.bool,
  autoscalingEnabled: PropTypes.bool,
  change: PropTypes.func.isRequired,
  autoScaleMinNodesValue: PropTypes.string,
  autoScaleMaxNodesValue: PropTypes.string,
  minNodesRequired: PropTypes.number,
  nodeIncrement: PropTypes.number,
  clusterVersionRawId: PropTypes.string.isRequired,
  imds: PropTypes.string,
  poolNumber: PropTypes.number,
  isHypershift: PropTypes.bool,
  maxWorkerVolumeSizeGiB: PropTypes.number.isRequired,
};

export default MachinePoolScreen;
