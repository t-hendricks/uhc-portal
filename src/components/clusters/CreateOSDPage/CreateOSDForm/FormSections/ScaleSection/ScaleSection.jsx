import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  FormGroup,
  GridItem,
  ExpandableSection,
} from '@patternfly/react-core';

import MachineTypeSelection from './MachineTypeSelection';
import ReduxVerticalFormGroup from '../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import PersistentStorageDropdown from '../../../../common/PersistentStorageDropdown';
import LoadBalancersDropdown from '../../../../common/LoadBalancersDropdown';
import NodeCountInput from '../../../../common/NodeCountInput';
import { constants } from '../../CreateOSDFormConstants';

import PopoverHint from '../../../../../common/PopoverHint';
import { required, checkMachinePoolLabels } from '../../../../../../common/validators';

function ScaleSection({
  pending,
  isBYOC,
  isMultiAz,
  machineType,
  handleMachineTypesChange,
  cloudProviderID,
  showStorageAndLoadBalancers = true,
  gridSpan = 9,
  minNodes,
  isMachinePool = false,
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
          extendedHelpText={constants.computeNodeCountHint}
          cloudProviderID={cloudProviderID}
          minNodes={minNodes}
          isMachinePool={isMachinePool}
        />
      </GridItem>
      <GridItem span={8} />
      <GridItem span={4}>
        <ExpandableSection
          toggleTextCollapsed="Edit node labels"
          toggleTextExpanded="Edit node labels"
        >
          <FormGroup label="Node labels">
            <Field
              component={ReduxVerticalFormGroup}
              arid-label="Node labels"
              name="node_labels"
              type="text"
              helpText="Comma separated pairs in key=value format."
              key="node_label"
              disabled={pending}
              validate={checkMachinePoolLabels}
            />
          </FormGroup>
        </ExpandableSection>
      </GridItem>
      <GridItem span={8} />
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
  handleMachineTypesChange: PropTypes.func.isRequired,
  gridSpan: PropTypes.number,
  minNodes: PropTypes.number,
  isMachinePool: PropTypes.bool,
};

export default ScaleSection;
