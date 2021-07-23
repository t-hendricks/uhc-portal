import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import {
  FormGroup,
  GridItem,
  ExpandableSection,
  Title,
} from '@patternfly/react-core';

import MachineTypeSelection from './MachineTypeSelection';

import { ReduxFormKeyValueList, ReduxFormTaints } from '../../../../../common/ReduxFormComponents';
import PersistentStorageDropdown from '../../../../common/PersistentStorageDropdown';
import LoadBalancersDropdown from '../../../../common/LoadBalancersDropdown';
import NodeCountInput from '../../../../common/NodeCountInput';
import { normalizedProducts, billingModels } from '../../../../../../common/subscriptionTypes';
import { constants } from '../../CreateOSDFormConstants';

import PopoverHint from '../../../../../common/PopoverHint';
import { required } from '../../../../../../common/validators';
import ExternalLink from '../../../../../common/ExternalLink';

import AutoScaleSection from './AutoScaleSection/AutoScaleSection';

function ScaleSection({
  pending,
  isBYOC,
  isMultiAz,
  machineType,
  handleMachineTypesChange,
  cloudProviderID,
  product,
  showStorageAndLoadBalancers = true,
  minNodes,
  isMachinePool = false,
  canAutoScale = false,
  autoscalingEnabled = false,
  inModal = false,
  autoScaleMinNodesValue = '0',
  autoScaleMaxNodesValue = '0',
  change,
  billingModel,
}) {
  const expandableSectionTitle = isMachinePool ? 'Edit node labels and taints' : 'Edit node labels';

  const labelsAndTaintsSection = (
    <ExpandableSection
      toggleTextCollapsed={expandableSectionTitle}
      toggleTextExpanded={expandableSectionTitle}
    >
      <GridItem sm={12} md={5} lg={4} className="pf-u-mb-md">
        <Title headingLevel="h3">Node labels</Title>
      </GridItem>
      <GridItem sm={12} md={5} lg={4}>
        <FieldArray name="node_labels" component={ReduxFormKeyValueList} />
      </GridItem>
      {isMachinePool
        && (
          <>
            <GridItem sm={12} md={5} lg={4} className="pf-u-mb-md pf-u-mt-lg">
              <Title headingLevel="h3">Taints</Title>
            </GridItem>
            <FieldArray name="taints" component={ReduxFormTaints} />
          </>
        )}
    </ExpandableSection>
  );

  return (
    <>
      {/* Instance type */}
      <GridItem sm={12} md={5} lg={4}>
        <FormGroup
          className="pf-u-mb-md"
          label="Worker node instance type"
          isRequired
          fieldId="node_type"
          labelIcon={<PopoverHint hint={constants.computeNodeInstanceTypeHint} />}
        >
          <Field
            component={MachineTypeSelection}
            name="machine_type"
            validate={required}
            disabled={pending}
            isMultiAz={isMultiAz}
            isBYOC={isBYOC}
            onChange={handleMachineTypesChange}
            cloudProviderID={cloudProviderID}
            product={product}
            isMachinePool={isMachinePool}
            billingModel={billingModel}
            inModal={inModal}
          />
        </FormGroup>
      </GridItem>
      <GridItem md={7} lg={8} />
      {/* autoscale */}
      <GridItem sm={12} md={5} lg={4}>
        {canAutoScale
          && (
            <>
              <AutoScaleSection
                autoscalingEnabled={autoscalingEnabled}
                isMultiAz={isMultiAz}
                change={change}
                autoScaleMinNodesValue={autoScaleMinNodesValue}
                autoScaleMaxNodesValue={autoScaleMaxNodesValue}
                product={product}
                isBYOC={isBYOC}
                isDefaultMachinePool={!isMachinePool}
              />
              {autoscalingEnabled && labelsAndTaintsSection}
            </>
          )}
        {/* Worker nodes */}
        {!autoscalingEnabled && (
          <>
            <Field
              component={NodeCountInput}
              name="nodes_compute"
              label={isMultiAz ? 'Worker node count (per zone)' : 'Worker node count'}
              isMultiAz={isMultiAz}
              isByoc={isBYOC}
              machineType={machineType}
              isDisabled={pending}
              extendedHelpText={(
                <>
                  {constants.computeNodeCountHint}
                  {' '}
                  <ExternalLink href="https://www.openshift.com/products/dedicated/service-definition#compute-instances">Learn more about worker node count</ExternalLink>
                </>
              )}
              cloudProviderID={cloudProviderID}
              product={product}
              minNodes={minNodes}
              isMachinePool={isMachinePool}
              billingModel={billingModel}
            />
            {labelsAndTaintsSection}

          </>
        )}
      </GridItem>
      <GridItem md={7} lg={8} />
      {/* Persistent Storage & Load Balancers */}
      { showStorageAndLoadBalancers && !isBYOC && (
        <>
          <GridItem sm={12} md={5} lg={4}>
            <FormGroup
              label="Persistent storage"
              fieldId="persistent_storage"
              labelIcon={<PopoverHint hint={constants.persistentStorageHint} />}
            >
              <Field
                name="persistent_storage"
                component={PersistentStorageDropdown}
                disabled={pending}
                currentValue={null}
                cloudProviderID={cloudProviderID}
                billingModel={billingModel}
                product={product}
                isBYOC={isBYOC}
                isMultiAZ={isMultiAz}
              />
            </FormGroup>
          </GridItem>
          <GridItem md={7} lg={8} />

          <GridItem sm={12} md={5} lg={4}>
            <FormGroup
              label="Load balancers"
              fieldId="load_balancers"
              labelIcon={<PopoverHint hint={constants.loadBalancersHint} />}
            >
              <Field
                name="load_balancers"
                component={LoadBalancersDropdown}
                disabled={pending}
                currentValue={null}
                cloudProviderID={cloudProviderID}
                billingModel={billingModel}
                product={product}
                isBYOC={isBYOC}
                isMultiAZ={isMultiAz}
              />
            </FormGroup>
          </GridItem>
          <GridItem md={7} lg={8} />
        </>
      )}
    </>
  );
}

ScaleSection.defaultProps = {
  billingModel: billingModels.STANDARD,
};

ScaleSection.propTypes = {
  pending: PropTypes.bool,
  isBYOC: PropTypes.bool.isRequired,
  isMultiAz: PropTypes.bool.isRequired,
  inModal: PropTypes.bool,
  showStorageAndLoadBalancers: PropTypes.bool,
  machineType: PropTypes.string.isRequired,
  cloudProviderID: PropTypes.string.isRequired,
  product: PropTypes.oneOf(Object.keys(normalizedProducts)).isRequired,
  billingModel: PropTypes.oneOf(Object.values(billingModels)),
  handleMachineTypesChange: PropTypes.func.isRequired,
  minNodes: PropTypes.number,
  isMachinePool: PropTypes.bool,
  canAutoScale: PropTypes.bool,
  autoscalingEnabled: PropTypes.bool,
  change: PropTypes.func.isRequired,
  autoScaleMinNodesValue: PropTypes.string,
  autoScaleMaxNodesValue: PropTypes.string,
};

export default ScaleSection;
