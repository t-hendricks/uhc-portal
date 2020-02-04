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
import ErrorBox from '../../../../../../common/ErrorBox';
import filterLoadBalancerValuesByQuota from './helpers';

class LoadBalancersComboBox extends React.Component {
  componentDidMount() {
    const {
      getLoadBalancers, loadBalancerValues,
    } = this.props;
    if (!loadBalancerValues.pending && !loadBalancerValues.fulfilled && !loadBalancerValues.error) {
      // fetch load balancers from server only if needed.
      getLoadBalancers();
    }
  }

  render() {
    const {
      input, loadBalancerValues, disabled, currentValue, quota,
    } = this.props;
    // Set up options for load balancers
    const loadBalancerOption = value => (
      <FormSelectOption key={value} value={value} label={value} />
    );
    if (loadBalancerValues.fulfilled) {
      const remainingQuota = get(quota, 'loadBalancerQuota', 0);
      const filteredValues = filterLoadBalancerValuesByQuota(currentValue,
        loadBalancerValues, remainingQuota);
      const isDisabled = disabled || (filteredValues.values.length <= 1);
      return (
        <FormSelect
          className="quota-combo-box"
          aria-label="Load Balancers"
          isDisabled={isDisabled}
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
  currentValue: PropTypes.number,
};

export default LoadBalancersComboBox;
