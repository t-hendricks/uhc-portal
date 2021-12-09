import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert, FormGroup, FormSelect, FormSelectOption,
} from '@patternfly/react-core';

class GCPVPCSubnet extends React.Component {
  componentDidMount() {
    if (this.currentValueIrrelevant()) {
      const { input } = this.props;
      input.onChange('');
    }
  }

  componentDidUpdate() {
    if (this.currentValueIrrelevant()) {
      const { input } = this.props;
      input.onChange('');
    }
  }

  getVPCSubnets = () => {
    const { vpcs, vpcName } = this.props;
    const selectedVPC = vpcs?.data?.items?.find(item => item.name === vpcName);
    return selectedVPC?.subnets || [];
  };

  currentValueIrrelevant = () => {
    const {
      hasDependencies, matchesDependencies, vpcs, input,
    } = this.props;
    if (!input.value) {
      // Blank/placeholder always legitimate.
      return false;
    }
    if (!hasDependencies) {
      // Can't make request.
      return true;
    }
    if (matchesDependencies && vpcs.fulfilled) {
      // Made request and current value is no longer valid.
      const items = this.getVPCSubnets();
      return !items.some(item => item === input.value);
    }
    return false;
  }

  render() {
    const {
      vpcs,
      matchesDependencies,
      input,
      label,
      placeholder,
      emptyPlaceholder,
      meta,
    } = this.props;
    const show = matchesDependencies && vpcs.fulfilled;
    const items = this.getVPCSubnets();

    let options;
    if (show) {
      if (items.length > 0) {
        options = (
          <>
            <FormSelectOption isDisabled isPlaceholder value="" label={placeholder} />
            {items.map(item => (
              <FormSelectOption key={item} value={item} label={item} />
            ))}
          </>
        );
      } else {
        options = (
          <FormSelectOption isDisabled isPlaceholder value="" label={emptyPlaceholder} />
        );
      }
    } else if (vpcs.pending) {
      options = (
        <FormSelectOption isDisabled value="" label="Loading..." />
      );
    } else {
      options = (
        <FormSelectOption isDisabled value="" label="" />
      );
    }

    // Prevent FormSelect from picking wrong option when valid options changed.
    // https://github.com/patternfly/patternfly-react/issues/5687
    const value = this.currentValueIrrelevant() ? '' : input.value;

    return (
      <FormGroup
        label={label}
        validated={meta.touched && meta.invalid ? 'error' : 'default'}
        helperTextInvalid={meta.error}
        fieldId={input.name}
      >
        {matchesDependencies && vpcs.error && (
          <Alert variant="danger" isInline title="Failed to list existing VPC subnets using your GCP credentials">
            Verify that your entered service account details are correct
          </Alert>
        )}
        <FormSelect
          aria-label={label}
          isDisabled={!(show && items.length > 0)}
          {...input}
          value={value}
        >
          {options}
        </FormSelect>
      </FormGroup>
    );
  }
}
GCPVPCSubnet.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  emptyPlaceholder: PropTypes.string.isRequired,
  // redux-form metadata like error or active states
  meta: PropTypes.object.isRequired,
  region: PropTypes.string.isRequired,
  vpcName: PropTypes.string.isRequired,
  hasDependencies: PropTypes.bool.isRequired,
  matchesDependencies: PropTypes.bool.isRequired,
  vpcs: PropTypes.object.isRequired,
  getGCPCloudProviderVPCs: PropTypes.func.isRequired,
};

export default GCPVPCSubnet;
