import React from 'react';
import PropTypes from 'prop-types';
import {
  FormSelect,
  FormSelectOption,
  FormGroup,
  Tooltip,
} from '@patternfly/react-core';
import range from 'lodash/range';

import PopoverHint from '../../../common/PopoverHint';
import { noQuotaTooltip } from '../../../../common/helpers';
import { normalizedProducts, billingModels } from '../../../../common/subscriptionTypes';
import { availableNodesFromQuota } from '../quotaSelectors';

export const MAX_NODES = 180;

class NodeCountInput extends React.Component {
  componentDidUpdate() {
    const { input, isEditingCluster } = this.props;
    const minimum = this.getMinimumValue();
    const available = this.getAvailableQuota();
    if (available === 0 && input.value !== minimum && !isEditingCluster) {
      // set input value to minimum if we don't have quota for it (and will be disabled)
      // this can happen if the user set a value, then switched to a machine type
      // where they have less quota than that value.
      input.onChange(minimum);
    }
  }

  getMinimumValue() {
    const { isMultiAz, isByoc, minNodes } = this.props;
    if (minNodes !== undefined) {
      return minNodes;
    }
    if (isByoc) {
      return isMultiAz ? 3 : 2;
    }
    return isMultiAz ? 9 : 4;
  }

  getIncludedNodes() {
    const { isByoc, isMultiAz, isMachinePool } = this.props;
    if (isByoc || isMachinePool) {
      return 0;
    }
    return isMultiAz ? 9 : 4;
  }

  getAvailableQuota() {
    const {
      quota,
      isByoc,
      machineType,
      machineTypesByID,
      cloudProviderID,
      product,
      billingModel,
    } = this.props;

    const machineTypeResource = machineTypesByID[machineType];
    if (!machineTypeResource) {
      return 0;
    }
    const resourceName = machineTypeResource.generic_name;

    const quotaParams = {
      product,
      cloudProviderID,
      isBYOC: isByoc,
      resourceName,
      billingModel,
    };
    return availableNodesFromQuota(quota, quotaParams);
  }

  render() {
    const {
      input, isMultiAz, isDisabled, isEditingCluster, currentNodeCount,
      label, helpText, extendedHelpText, machineType, isByoc, isMachinePool,
    } = this.props;

    const included = this.getIncludedNodes();
    const available = this.getAvailableQuota();
    const minimum = this.getMinimumValue();
    const increment = isMultiAz ? 3 : 1; // MultiAz requires nodes to be a multiple of 3
    // no extra node quota = only base cluster size is available
    const optionsAvailable = (available > 0 || isEditingCluster);
    let maxValue = isEditingCluster ? available + currentNodeCount : available + included;
    if (maxValue > MAX_NODES) {
      maxValue = MAX_NODES;
    }

    const options = optionsAvailable ? range(minimum, maxValue + 1, increment) : [minimum];

    let notEnoughQuota = options.length < 1;

    // for BYOC lacking node quota machineType will be undefined
    if (isByoc && !isEditingCluster && !isMachinePool) {
      notEnoughQuota = !machineType || options.length < 1;
    }
    const disabled = isDisabled || notEnoughQuota;

    // Set up options for load balancers
    const option = value => (
      <FormSelectOption
        key={value}
        value={value}
      // we want the value to be the actual value sent to the server,
      // but for multiAz the user selects the amount of nodes per zone, instead of total
      // so it needs to be divided by 3 for display
        label={isMultiAz ? (value / 3).toString() : value.toString()}
      />
    );

    const formSelect = (
      <FormSelect
        aria-label="Compute nodes"
        isDisabled={disabled}
        className="quota-dropdown"
        {...input}
      >
        {options.map(value => option(value))}
      </FormSelect>
    );

    return (
      <FormGroup
        fieldId={input.name}
        label={label}
        helperText={helpText}
        labelIcon={extendedHelpText && (<PopoverHint hint={extendedHelpText} />)}
      >
        {notEnoughQuota ? (
          <Tooltip
            content={noQuotaTooltip}
            position="right"
          >
            <div>
              {formSelect}
            </div>
          </Tooltip>
        ) : formSelect}
        { isMultiAz && (
        <span>
          × 3 zones =
          {' '}
          {input.value}
          {' '}
          compute nodes
        </span>
        )}
      </FormGroup>
    );
  }
}

NodeCountInput.propTypes = {
  isEditingCluster: PropTypes.bool,
  currentNodeCount: PropTypes.number,
  minNodes: PropTypes.number,
  isDisabled: PropTypes.bool,
  label: PropTypes.string,
  helpText: PropTypes.string,
  extendedHelpText: PropTypes.string,
  quota: PropTypes.object.isRequired,
  isByoc: PropTypes.bool,
  isMachinePool: PropTypes.bool,
  isMultiAz: PropTypes.bool,
  machineType: PropTypes.string,
  machineTypesByID: PropTypes.object,
  input: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
  }),
  cloudProviderID: PropTypes.string.isRequired,
  product: PropTypes.oneOf(Object.keys(normalizedProducts)).isRequired,
  billingModel: PropTypes.oneOf(Object.values(billingModels)).isRequired,
};

export default NodeCountInput;
