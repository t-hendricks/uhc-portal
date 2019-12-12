// LoadBalancersComboBox shows a selection of load balancer
// options for setting on the installed a cluster.
// it is meant to be used in a redux-form <Field> and expects an onChange callback.

import React from 'react';
import PropTypes from 'prop-types';
import {
  Select,
  SelectOption,
  SelectVariant,
} from '@patternfly/react-core';

import { Spinner } from '@redhat-cloud-services/frontend-components';
import ErrorBox from '../../../../common/ErrorBox';

class LoadBalancersComboBox extends React.Component {
  state = {
    isExpanded: false,
  };

  componentDidMount() {
    const { getLoadBalancers, loadBalancerValues } = this.props;
    if (!loadBalancerValues.fulfilled) {
      // Don't let the user submit if we couldn't get load balancers yet.
      this.setInvalidValue();
    }
    if (!loadBalancerValues.pending && !loadBalancerValues.fulfilled) {
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

  onSelect = (event, selection) => {
    const { input } = this.props;
    this.setState({ isExpanded: false });
    input.onChange(selection);
  };

  onToggle = (isExpanded) => {
    this.setState({
      isExpanded,
    });
  };

  setInvalidValue() {
    // Tell redux form the current value of this field is empty.
    // This will cause it to not pass validation if it is required.
    const { input } = this.props;
    input.onChange('');
  }

  render() {
    const {
      input, loadBalancerValues, disabled,
    } = this.props;
    const {
      isExpanded,
    } = this.state;

    // Set up options for load balancers
    const loadBalancerOption = value => (
      <SelectOption
        key={value.toString()}
        value={value.toString()}
      >
        {value}
      </SelectOption>
    );
    if (loadBalancerValues.fulfilled) {
      return (
        <Select
          className="quota-combo-box"
          variant={SelectVariant.single}
          aria-label="Load Balancers"
          onToggle={this.onToggle}
          onSelect={this.onSelect}
          selections={input.value}
          isExpanded={isExpanded}
          disabled={disabled}
        >
          {loadBalancerValues.values.map(value => loadBalancerOption(value))}
        </Select>
      );
    }

    return loadBalancerValues.error ? (
      <ErrorBox message="Error loading load balancers list" response={loadBalancerValues} />
    ) : (
      <React.Fragment>
        <div className="spinner-fit-container"><Spinner /></div>
        <div className="spinner-loading-text">Loading load balancers list...</div>
      </React.Fragment>
    );
  }
}

LoadBalancersComboBox.propTypes = {
  getLoadBalancers: PropTypes.func.isRequired,
  loadBalancerValues: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default LoadBalancersComboBox;
