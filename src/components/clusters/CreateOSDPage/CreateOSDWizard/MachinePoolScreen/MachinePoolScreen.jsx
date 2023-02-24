import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, Title, Form, Text } from '@patternfly/react-core';
import { normalizedProducts, billingModels } from '../../../../../common/subscriptionTypes';
import ScaleSection from '../../CreateOSDForm/FormSections/ScaleSection/ScaleSection';

function DefaultMachinePoolScreen({
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
  formValues,
}) {
  const isHypershift = formValues.hypershift === 'true';
  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        return false;
      }}
    >
      <Grid hasGutter>
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
          isHypershift={isHypershift}
        />
      </Grid>
    </Form>
  );
}

DefaultMachinePoolScreen.propTypes = {
  isByoc: PropTypes.bool.isRequired,
  isMultiAz: PropTypes.bool.isRequired,
  machineType: PropTypes.string.isRequired,
  cloudProviderID: PropTypes.string.isRequired,
  product: PropTypes.oneOf(Object.keys(normalizedProducts)).isRequired,
  billingModel: PropTypes.oneOf(Object.values(billingModels)),
  canAutoScale: PropTypes.bool,
  autoscalingEnabled: PropTypes.bool,
  change: PropTypes.func.isRequired,
  autoScaleMinNodesValue: PropTypes.string,
  autoScaleMaxNodesValue: PropTypes.string,
  formValues: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  ),
};

export default DefaultMachinePoolScreen;
