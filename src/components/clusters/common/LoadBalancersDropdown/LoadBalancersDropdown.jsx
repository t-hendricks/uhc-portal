// LoadBalancersDropdown shows a selection of load balancer
// options for setting on the installed a cluster.
// it is meant to be used in a redux-form <Field> and expects an onChange callback.

import React from 'react';
import PropTypes from 'prop-types';
import {
  FormSelect,
  FormSelectOption,
  Tooltip,
} from '@patternfly/react-core';

import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import ErrorBox from '../../../common/ErrorBox';
import { availableQuota, quotaTypes } from '../quotaSelectors';
import { filterLoadBalancerValuesByQuota } from './LoadBalancersDropdownHelper';
import { noQuotaTooltip } from '../../../../common/helpers';

class LoadBalancersDropdown extends React.Component {
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
      input, loadBalancerValues, disabled, currentValue, quotaList,
      billingModel, product, cloudProviderID, isBYOC, isMultiAZ,
    } = this.props;
    // Set up options for load balancers
    const loadBalancerOption = value => (
      <FormSelectOption key={value} value={value} label={value} />
    );
    if (loadBalancerValues.fulfilled) {
      const query = {
        resourceType: quotaTypes.LOAD_BALANCER,
        billingModel,
        product,
        cloudProviderID,
        isBYOC,
        isMultiAZ,
      };
      const quota = availableQuota(quotaList, query);
      const filteredValues = filterLoadBalancerValuesByQuota(currentValue,
        loadBalancerValues, quota);
      const notEnoughQuota = filteredValues.values.length <= 1;
      const isDisabled = disabled || notEnoughQuota;
      const formSelect = (
        <FormSelect
          className="quota-dropdown"
          aria-label="Load Balancers"
          isDisabled={isDisabled}
          {...input}
        >
          {filteredValues.values.map(value => loadBalancerOption(value.toString()))}
        </FormSelect>
      );
      if (notEnoughQuota) {
        return (
          <Tooltip
            content={noQuotaTooltip}
            position="right"
          >
            <div>
              {formSelect}
            </div>
          </Tooltip>
        );
      }
      return formSelect;
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

LoadBalancersDropdown.propTypes = {
  getLoadBalancers: PropTypes.func.isRequired,
  loadBalancerValues: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  quotaList: PropTypes.object.isRequired,
  currentValue: PropTypes.number,
  billingModel: PropTypes.string.isRequired,
  product: PropTypes.string.isRequired,
  cloudProviderID: PropTypes.string.isRequired,
  isBYOC: PropTypes.bool.isRequired,
  isMultiAZ: PropTypes.bool.isRequired,
};

export default LoadBalancersDropdown;
