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
  isHypershiftSelected,
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
  selectedVPCID,
  clusterVersionRawId,
  imds,
}) {
  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        return false;
      }}
    >
      <Grid hasGutter>
        <MachinePoolScreenHeader isHypershiftSelected={isHypershiftSelected} />

        {isHypershiftSelected && <MachinePoolsSubnets selectedVPCID={selectedVPCID} />}

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
          showHypershiftTitle={isHypershiftSelected}
          minNodesRequired={minNodesRequired}
          clusterVersionRawId={clusterVersionRawId}
          imds={imds}
          isHypershiftSelected={isHypershiftSelected}
        />
      </Grid>
    </Form>
  );
}

MachinePoolScreen.propTypes = {
  isByoc: PropTypes.bool.isRequired,
  isMultiAz: PropTypes.bool.isRequired,
  isHypershiftSelected: PropTypes.bool.isRequired,
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
  clusterVersionRawId: PropTypes.string.isRequired,
  imds: PropTypes.string,
};

export default MachinePoolScreen;
