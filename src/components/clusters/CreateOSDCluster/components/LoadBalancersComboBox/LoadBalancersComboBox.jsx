// LoadBalancersComboBox shows a selection of load balancer
// options for setting on the installed a cluster.
// it is meant to be used in a redux-form <Field> and expects an onChange callback.

import React from 'react';
import PropTypes from 'prop-types';
import {
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core';

import get from 'lodash/get';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import ErrorBox from '../../../../common/ErrorBox';

class LoadBalancersComboBox extends React.Component {
  componentDidMount() {
    const {
      getLoadBalancers, loadBalancerValues,
      organization, getOrganizationAndQuota,
    } = this.props;
    if (!organization.fulfilled && !organization.pending) {
      getOrganizationAndQuota();
    }
    if (!loadBalancerValues.fulfilled) {
      // Don't let the user submit if we couldn't get load balancers yet.
      this.setInvalidValue();
    }
    if (!loadBalancerValues.pending && !loadBalancerValues.fulfilled && !loadBalancerValues.error) {
      // fetch load balancers from server only if needed.
      getLoadBalancers();
    }
  }

  componentDidUpdate() {
    const { loadBalancerValues } = this.props;
    if (loadBalancerValues.error || loadBalancerValues.pending) {
      // Don't let the user submit if we couldn't get load balancers.
      this.setInvalidValue();
    }
  }

  setInvalidValue() {
    // Tell redux form the current value of this field is empty.
    // This will cause it to not pass validation if it is required.
    const { input } = this.props;
    input.onChange('');
  }

  filterLoadBalancerValuesByQuota() {
    const { loadBalancerValues, quota } = this.props;
    const loadBalancerQuota = get(quota, 'loadBalancerQuota', 0);
    const result = { ...loadBalancerValues };
    result.values = result.values.filter(el => el <= loadBalancerQuota);
    return result;
  }

  render() {
    const {
      input, loadBalancerValues, disabled,
    } = this.props;

    // Set up options for load balancers
    const loadBalancerOption = value => (
      <FormSelectOption key={value} value={value} label={value} />
    );
    if (loadBalancerValues.fulfilled) {
      const filteredValues = this.filterLoadBalancerValuesByQuota();
      return (
        <FormSelect
          className="quota-combo-box"
          aria-label="Load Balancers"
          isDisabled={disabled}
          {...input}
        >
          {filteredValues.values.map(value => loadBalancerOption(value.toString()))}
        </FormSelect>
      );
    }

    return loadBalancerValues.error ? (
      <ErrorBox message="Error loading load balancers list" response={loadBalancerValues} />
    ) : (
      <>
        <div className="spinner-fit-container"><Spinner /></div>
        <div className="spinner-loading-text">Loading load balancers list...</div>
      </>
    );
  }
}

LoadBalancersComboBox.propTypes = {
  getLoadBalancers: PropTypes.func.isRequired,
  loadBalancerValues: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  quota: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  getOrganizationAndQuota: PropTypes.func.isRequired,
};

export default LoadBalancersComboBox;
