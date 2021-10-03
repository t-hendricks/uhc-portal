import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import {
  FormGroup,
  Grid,
  GridItem,
  ExpandableSection,
  Title,
  Form,
  Text,
  Alert,
} from '@patternfly/react-core';

import MachineTypeSelection from '../../CreateOSDForm/FormSections/ScaleSection/MachineTypeSelection';

import { ReduxFormKeyValueList } from '../../../../common/ReduxFormComponents';
import NodeCountInput from '../../../common/NodeCountInput';
import { normalizedProducts, billingModels } from '../../../../../common/subscriptionTypes';
import { constants } from '../../CreateOSDForm/CreateOSDFormConstants';

import PopoverHint from '../../../../common/PopoverHint';
import { required } from '../../../../../common/validators';
import ExternalLink from '../../../../common/ExternalLink';

import AutoScaleSection from '../../CreateOSDForm/FormSections/ScaleSection/AutoScaleSection/AutoScaleSection';

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
          <FormGroup
            label="Worker node instance type"
            isRequired
            fieldId="node_type"
            labelIcon={<PopoverHint hint={constants.computeNodeInstanceTypeHint} />}
          >
            <Field
              component={MachineTypeSelection}
              name="machine_type"
              validate={required}
              isMultiAz={isMultiAz}
              isBYOC={isByoc}
              cloudProviderID={cloudProviderID}
              product={product}
              billingModel={billingModel}
              isMachinePool={false}
            />
          </FormGroup>
        </GridItem>
        <GridItem md={7} lg={8} />
        {canAutoScale
          && (
            <>
              <GridItem sm={12} md={5} lg={4}>
                <AutoScaleSection
                  autoscalingEnabled={autoscalingEnabled}
                  isMultiAz={isMultiAz}
                  change={change}
                  autoScaleMinNodesValue={autoScaleMinNodesValue}
                  autoScaleMaxNodesValue={autoScaleMaxNodesValue}
                  product={product}
                  isBYOC={isByoc}
                  isDefaultMachinePool
                />
                {!autoscalingEnabled && (
                <>
                  <Field
                    component={NodeCountInput}
                    name="nodes_compute"
                    label={isMultiAz ? 'Worker node count (per zone)' : 'Worker node count'}
                    isMultiAz={isMultiAz}
                    isByoc={isByoc}
                    machineType={machineType}
                    extendedHelpText={(
                      <>
                        {constants.computeNodeCountHint}
                        {' '}
                        <ExternalLink href="https://www.openshift.com/products/dedicated/service-definition#compute-instances">Learn more about worker node count</ExternalLink>
                      </>
              )}
                    cloudProviderID={cloudProviderID}
                    product={product}
                    billingModel={billingModel}
                  />
                </>
                )}
              </GridItem>
              <GridItem md={7} lg={8} />
            </>
          )}
        <ExpandableSection
          toggleText="Edit node labels"
        >
          <Grid>
            <GridItem className="pf-u-mb-md">
              <Title headingLevel="h3">Node labels</Title>
            </GridItem>
            <GridItem sm={12} md={5} lg={4}>
              <FieldArray name="node_labels" component={ReduxFormKeyValueList} />
            </GridItem>
            <GridItem span={10}>
              <Alert
                id="node-labels-alert"
                variant="info"
                isInline
                title="Node labels cannot be edited after cluster creation"
              >
                The node labels in the default machine pool cannot be changed
                after creating the cluster. Other machine pools can be added
                to the cluster with additional labels.
              </Alert>
            </GridItem>
          </Grid>
        </ExpandableSection>
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
