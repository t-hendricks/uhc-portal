import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  FormGroup,
  GridItem,
} from '@patternfly/react-core';

import MachineTypeSelection from './MachineTypeSelection';
import PersistentStorageDropdown from '../../../../common/PersistentStorageDropdown';
import LoadBalancersDropdown from '../../../../common/LoadBalancersDropdown';
import NodeCountInput from '../../../../common/NodeCountInput';
import { constants } from '../../CreateOSDFormConstants';

import PopoverHint from '../../../../../common/PopoverHint';
import { required } from '../../../../../../common/validators';

function ScaleSection({
  pending, isBYOC, isMultiAz, machineType, handleMachineTypesChange, cloudProviderID,
}) {
  return (
    <>
      {/* Instance type */}
      <GridItem span={9}>
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
          />
        </FormGroup>
      </GridItem>
      <GridItem span={3} />
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
        />
      </GridItem>
      <GridItem span={8} />

      {/* Persistent Storage & Load Balancers */}
      { !isBYOC && (
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
  machineType: PropTypes.string.isRequired,
  cloudProviderID: PropTypes.string.isRequired,
  handleMachineTypesChange: PropTypes.func.isRequired,
};

export default ScaleSection;
