import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert, FormGroup, FormSelect, FormSelectOption,
} from '@patternfly/react-core';

import { LIST_GCP_VPCS } from '../../ccsInquiriesActions';

class GCPVPCName extends React.Component {
  componentDidMount() {
    this.loadIfNeeded();
    if (this.currentValueIrrelevant()) {
      const { input } = this.props;
      input.onChange('');
    }
  }

  componentDidUpdate() {
    this.loadIfNeeded();
    if (this.currentValueIrrelevant()) {
      const { input } = this.props;
      input.onChange('');
    }
  }

  loadIfNeeded = () => {
    const {
      gcpVPCs,
      credentials,
      region,
      hasDependencies,
      matchesDependencies,
      getGCPCloudProviderVPCs,
    } = this.props;
    if (hasDependencies && !matchesDependencies && !gcpVPCs.pending) {
      getGCPCloudProviderVPCs(LIST_GCP_VPCS, credentials, region);
    }
  }

  currentValueIrrelevant = () => {
    const {
      hasDependencies, matchesDependencies, gcpVPCs, input,
    } = this.props;
    if (!input.value) {
      // Blank/placeholder always legitimate.
      return false;
    }
    if (!hasDependencies) {
      // Can't make request.
      return true;
    }
    if (matchesDependencies && gcpVPCs.fulfilled) {
      // Made request and current value is no longer valid.
      const items = gcpVPCs.data?.items || [];
      return !items.some(item => item.name === input.value);
    }
    return false;
  }

  render() {
    const {
      gcpVPCs,
      matchesDependencies,
      input,
      label,
      placeholder,
      emptyPlaceholder,
      meta,
    } = this.props;
    const show = matchesDependencies && gcpVPCs.fulfilled;
    const items = gcpVPCs?.data?.items || [];

    let options;
    if (show) {
      if (items.length > 0) {
        options = (
          <>
            <FormSelectOption isDisabled isPlaceholder value="" label={placeholder} />
            {items.map(({ name }) => (
              <FormSelectOption key={name} value={name} label={name} />
            ))}
          </>
        );
      } else {
        options = (
          <FormSelectOption isDisabled isPlaceholder value="" label={emptyPlaceholder} />
        );
      }
    } else if (gcpVPCs.pending) {
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
        {matchesDependencies && gcpVPCs.error && (
          <Alert variant="danger" isInline title="Failed to list existing VPCs using your GCP credentials">
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
GCPVPCName.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  emptyPlaceholder: PropTypes.string.isRequired,
  // redux-form metadata like error or active states
  meta: PropTypes.object.isRequired,
  credentials: PropTypes.string.isRequired,
  region: PropTypes.string.isRequired,
  hasDependencies: PropTypes.bool.isRequired,
  matchesDependencies: PropTypes.bool.isRequired,
  gcpVPCs: PropTypes.object.isRequired,
  getGCPCloudProviderVPCs: PropTypes.func.isRequired,
};

export default GCPVPCName;
