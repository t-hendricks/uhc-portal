import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import {
  FormGroup,
  GridItem,
  ExpandableSection,
} from '@patternfly/react-core';

import MachineTypeSelection from './MachineTypeSelection';
import { ReduxFormKeyValueList } from '../../../../../common/ReduxFormComponents';
import PersistentStorageDropdown from '../../../../common/PersistentStorageDropdown';
import LoadBalancersDropdown from '../../../../common/LoadBalancersDropdown';
import NodeCountInput from '../../../../common/NodeCountInput';
import { constants } from '../../CreateOSDFormConstants';

import PopoverHint from '../../../../../common/PopoverHint';
import { required } from '../../../../../../common/validators';

function ScaleSection({
  pending,
  isBYOC,
  isMultiAz,
  machineType,
  handleMachineTypesChange,
  cloudProviderID,
  product,
  showStorageAndLoadBalancers = true,
  gridSpan = 9,
  minNodes,
  isMachinePool = false,
  nodeLabelsGridSpan = 4,
}) {
  return (
    <>
      {/* Instance type */}
      <GridItem span={gridSpan}>
        <FormGroup
          label="Compute node instance type"
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
          />
        </FormGroup>
      </GridItem>
      {gridSpan === 9 && <GridItem span={3} />}
      {/* Compute nodes */}
      <GridItem span={4}>
        <Field
          component={NodeCountInput}
          name="nodes_compute"
          label={isMultiAz ? 'Compute node count (per zone)' : 'Compute node count'}
          isMultiAz={isMultiAz}
          isByoc={isBYOC}
          machineType={machineType}
          isDisabled={pending}
          extendedHelpText={isBYOC
            ? constants.computeNodeCountHintCCS
            : constants.computeNodeCountHint}
          cloudProviderID={cloudProviderID}
          product={product}
          minNodes={minNodes}
          isMachinePool={isMachinePool}
        />
      </GridItem>
      <GridItem span={8} />
      <GridItem span={nodeLabelsGridSpan}>
        <ExpandableSection
          toggleTextCollapsed="Edit node labels"
          toggleTextExpanded="Edit node labels"
        >
          <FieldArray name="node_labels" component={ReduxFormKeyValueList} />
        </ExpandableSection>
      </GridItem>
      <GridItem span={12 - nodeLabelsGridSpan} />
      {/* Persistent Storage & Load Balancers */}
      { showStorageAndLoadBalancers && !isBYOC && (
        <>
          <GridItem span={4}>
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
              />
            </FormGroup>
          </GridItem>
          <GridItem span={8} />

          <GridItem span={4}>
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
              />
            </FormGroup>
          </GridItem>
          <GridItem span={8} />
        </>
      )}
    </>
  );
}

ScaleSection.propTypes = {
  pending: PropTypes.bool,
  isBYOC: PropTypes.bool.isRequired,
  isMultiAz: PropTypes.bool.isRequired,
  showStorageAndLoadBalancers: PropTypes.bool,
  machineType: PropTypes.string.isRequired,
  cloudProviderID: PropTypes.string.isRequired,
  // For quota purposes, product is subscription.plan.id, not cluster.product.id.
  product: PropTypes.string.isRequired,
  handleMachineTypesChange: PropTypes.func.isRequired,
  gridSpan: PropTypes.number,
  nodeLabelsGridSpan: PropTypes.number,
  minNodes: PropTypes.number,
  isMachinePool: PropTypes.bool,
};

export default ScaleSection;
