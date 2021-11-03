import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  GridItem,
  Title,
  Form,
  Text,
} from '@patternfly/react-core';
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
}) {
  return (
    <Form onSubmit={() => false}>
      <Grid>
        <GridItem span={12}>
          <Title headingLevel="h2">
            Default machine pool
          </Title>
          <Text component="p">
            Select a compute node instance type and count for your default machine pool.
          </Text>
          <Text component="p">
            After cluster creation, your selected default machine pool instance type is permanent.
          </Text>
        </GridItem>
        <GridItem sm={12} md={5} lg={4}>
          <ScaleSection
            isBYOC={isByoc}
            isMultiAz={isMultiAz}
            machineType={machineType}
            handleMachineTypesChange={(_, value) => change('machine_type', value)}
            cloudProviderID={cloudProviderID}
            product={product}
            canAutoScale={canAutoScale}
            autoscalingEnabled={autoscalingEnabled}
            change={change}
            autoScaleMinNodesValue={autoScaleMinNodesValue}
            autoScaleMaxNodesValue={autoScaleMaxNodesValue}
            billingModel={billingModel}
            showStorageAndLoadBalancers={false}
          />
        </GridItem>
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
};

export default DefaultMachinePoolScreen;
