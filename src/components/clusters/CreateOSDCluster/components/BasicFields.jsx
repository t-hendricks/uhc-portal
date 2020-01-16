import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import {
  FormGroup,
  GridItem,
} from '@patternfly/react-core';
import CloudRegionComboBox from './CloudRegionComboBox';
import MachineTypeSelection from './MachineTypeSelection';
import PersistentStorageComboBox from './PersistentStorageComboBox';
import LoadBalancersComboBox from './LoadBalancersComboBox';
import { constants } from '../CreateOSDClusterHelper';

import PopoverHint from '../../../common/PopoverHint';
import ReduxVerticalFormGroup from '../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import validators, { required } from '../../../../common/validators';
import { minValueSelector } from '../../common/EditClusterDialog/EditClusterSelectors';
import RadioButtons from '../../../common/ReduxFormComponents/RadioButtons';

class BasicFields extends React.Component {
  state = {
    isMultiAz: false,
  };

  handleMultiAZChange = (_, value) => {
    const { change } = this.props;
    const isMultiAz = value === 'true';
    this.setState({ isMultiAz });
    change('nodes_compute', isMultiAz ? '9' : '4');
  };

  validateNodes = (nodeCount) => {
    const { isMultiAz } = this.state;
    const min = minValueSelector(isMultiAz);
    return validators.nodes(nodeCount, min);
  };

  // HACK: two validation functions that are the same. This allows to "replace" the validation
  // func on the compute nodes field, re-triggering validation when the multiAZ checkbox changes.

  validateNodesSingleAz = nodeCount => this.validateNodes(nodeCount);

  validateNodesMultiAz = nodeCount => this.validateNodes(nodeCount);

  render() {
    const {
      pending, showDNSBaseDomain, isBYOC,
    } = this.props;
    const { isMultiAz } = this.state;
    const min = minValueSelector(isMultiAz);

    return (
      <>
        {/* cluster name */}
        <GridItem span={4}>
          <Field
            component={ReduxVerticalFormGroup}
            name="name"
            label="Cluster name"
            type="text"
            validate={validators.checkClusterName}
            disabled={pending}
            isRequired
            extendedHelpText={constants.clusterNameHint}
          />
        </GridItem>
        <GridItem span={8} />

        {/* Base DNS domain */}
        {showDNSBaseDomain && (
          <>
            <GridItem span={4}>
              <Field
                component={ReduxVerticalFormGroup}
                name="dns_base_domain"
                label="Base DNS domain"
                type="text"
                validate={validators.checkBaseDNSDomain}
                disabled={pending}
                normalize={value => value.toLowerCase()}
              />
            </GridItem>
            <GridItem span={8} />
          </>
        )}

        {/* Region */}
        <GridItem span={4}>
          <FormGroup
            label="Region"
            isRequired
            fieldId="region"
          >
            <PopoverHint hint={constants.regionHint} />
            <Field
              component={CloudRegionComboBox}
              name="region"
              cloudProviderID="aws"
              disabled={pending}
              isRequired
            />
          </FormGroup>
        </GridItem>
        <GridItem span={8} />

        {/* Availability */}
        <GridItem span={4}>
          <FormGroup
            label="Availability"
            isRequired
            fieldId="availability-toggle"
          >
            <PopoverHint hint={constants.availabilityHint} />
            <Field
              component={RadioButtons}
              name="multi_az"
              disabled={pending}
              onChange={this.handleMultiAZChange}
              options={[{ value: 'false', label: 'Single Zone' }, { value: 'true', label: 'Multizone' }]}
              defaultValue="false"
            />
          </FormGroup>
        </GridItem>
        <GridItem span={8} />

        {/* Instance type */}
        <GridItem span={12}>
          <h3>Scale</h3>
          <p>
            The number and instance type of compute nodes in your cluster. After cluster creation
            you will be able to change the number of compute nodes in your cluster, but you will
            not be able to change the worker node instance type.
          </p>
        </GridItem>
        <GridItem span={9}>
          <FormGroup
            label="Compute node instance type"
            isRequired
            fieldId="node_type"
          >
            <PopoverHint hint={constants.computeNodeInstanceTypeHint} />
            <Field
              component={MachineTypeSelection}
              name="machine_type"
              validate={required}
              disabled={pending}
              isMultiAz={isMultiAz}
              isBYOC={isBYOC}
            />
          </FormGroup>
        </GridItem>

        {/* Compute nodes */}
        <GridItem span={4}>
          <Field
            component={ReduxVerticalFormGroup}
            name="nodes_compute"
            label="Compute node count"
            inputMode="numeric"
            min={min.value}
            validate={isMultiAz ? [this.validateNodesMultiAz, validators.nodesMultiAz]
              : this.validateNodesSingleAz}
            disabled={pending}
            isRequired
            extendedHelpText={constants.computeNodeCountHint}
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
              >
                <PopoverHint hint={constants.persistentStorageHint} />
                <Field
                  name="persistent_storage"
                  component={PersistentStorageComboBox}
                  disabled={pending}
                  currentValue={null}
                />
              </FormGroup>
            </GridItem>
            <GridItem span={8} />

            <GridItem span={4}>
              <FormGroup
                label="Load balancers"
                fieldId="load_balancers"
              >
                <PopoverHint hint={constants.loadBalancersHint} />
                <Field
                  name="load_balancers"
                  component={LoadBalancersComboBox}
                  disabled={pending}
                  currentValue={null}
                />
              </FormGroup>
            </GridItem>
          </>
        )}

      </>
    );
  }
}

BasicFields.propTypes = {
  change: PropTypes.func.isRequired,
  pending: PropTypes.bool,
  showDNSBaseDomain: PropTypes.bool,
  isBYOC: PropTypes.bool.isRequired,
};

export default BasicFields;
