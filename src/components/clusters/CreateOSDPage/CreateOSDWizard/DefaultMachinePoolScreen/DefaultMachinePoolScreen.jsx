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
        <GridItem span={4}>
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
        <GridItem span={8} />
        <GridItem span={4}>
          {canAutoScale
          && (
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
          )}
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
          <ExpandableSection
            toggleText="Edit node labels"
          >
            <GridItem span={4} className="pf-u-mb-md">
              <Title headingLevel="h3">Node labels</Title>
            </GridItem>
            <GridItem span={4}>
              <FieldArray name="node_labels" component={ReduxFormKeyValueList} />
            </GridItem>
          </ExpandableSection>
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
