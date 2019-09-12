import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import {
  FormGroup,
  GridItem,
} from '@patternfly/react-core';
import PopoverHint from '../../common/PopoverHint';
import ReduxVerticalFormGroupPF4 from '../../common/ReduxFormComponents/ReduxVerticalFormGroupPF4';
import CloudRegionComboBox from './CloudRegionComboBox';
import MachineTypeSelection from './components/MachineTypeSelection';
import validators, { required } from '../../../common/validators';
import minValueSelector from '../common/EditClusterDialog/EditClusterSelectors';
import RadioButtons from '../../common/ReduxFormComponents/RadioButtons';
import constants from './CreateOSDClusterHelper';
import { normalizeNodeCount } from '../../../common/helpers';

class ConfigurationForm extends React.Component {
  state = {
    isMultiAz: false,
  };

  handleMultiAZChange = (_, value) => {
    const { touch } = this.props;
    this.setState({ isMultiAz: value === 'true' });
    // mark Nodes input as touched to make sure validation is shown even if it's not touched.
    touch('nodes_compute');
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
      pending, showDNSBaseDomain,
    } = this.props;
    const { isMultiAz } = this.state;
    const min = minValueSelector(isMultiAz);
    return (
      <React.Fragment>
        <GridItem span={12}>
          <h3 className="osd-page-header">Cluster Details</h3>
        </GridItem>

        <GridItem span={4}>
          <Field
            component={ReduxVerticalFormGroupPF4}
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

        {showDNSBaseDomain && (
          <React.Fragment>
            <GridItem span={4}>
              <Field
                component={ReduxVerticalFormGroupPF4}
                name="dns_base_domain"
                label="Base DNS domain"
                type="text"
                validate={validators.checkBaseDNSDomain}
                disabled={pending}
                normalize={value => value.toLowerCase()}
              />
            </GridItem>
            <GridItem span={8} />
          </React.Fragment>
        )}

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
              validate={required}
              disabled={pending}
              isRequired
            />
          </FormGroup>
        </GridItem>
        <GridItem span={8} />

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
            />
          </FormGroup>
        </GridItem>

        <GridItem span={4}>
          <Field
            component={ReduxVerticalFormGroupPF4}
            name="nodes_compute"
            label="Compute node count"
            inputMode="numeric"
            min={min.value}
            normalize={normalizeNodeCount}
            validate={isMultiAz ? [this.validateNodesMultiAz, validators.nodesMultiAz]
              : this.validateNodesSingleAz}
            disabled={pending}
            isRequired
            extendedHelpText={constants.computeNodeCountHint}
          />
        </GridItem>
        <GridItem span={8} />

      </React.Fragment>
    );
  }
}

ConfigurationForm.propTypes = {
  touch: PropTypes.func.isRequired,
  pending: PropTypes.bool,
  showDNSBaseDomain: PropTypes.bool,
};

export default ConfigurationForm;
