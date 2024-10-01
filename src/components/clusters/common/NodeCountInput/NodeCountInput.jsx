import React from 'react';
import PropTypes from 'prop-types';

import { FormGroup, FormSelect, FormSelectOption, Tooltip } from '@patternfly/react-core';

import {
  getNodeIncrement,
  getNodeIncrementHypershift,
} from '~/components/clusters/ClusterDetails/components/MachinePools/machinePoolsHelper';
import {
  buildOptions,
  getAvailableQuota as getAvailableQuotaUtil,
  getIncludedNodes,
  getMaxNodesHCP,
} from '~/components/clusters/common/machinePools/utils';
import { FormGroupHelperText } from '~/components/common/FormGroupHelperText';

import { noQuotaTooltip } from '../../../../common/helpers';
import { billingModels, normalizedProducts } from '../../../../common/subscriptionTypes';
import PopoverHint from '../../../common/PopoverHint';

const incrementValue = ({ isHypershiftWizard, poolNumber, isMultiAz }) =>
  isHypershiftWizard ? getNodeIncrementHypershift(poolNumber) : getNodeIncrement(isMultiAz);

class NodeCountInput extends React.Component {
  componentDidMount() {
    const {
      input,
      minNodes,
      isEditingCluster,
      currentNodeCount,
      increment,
      isHypershiftWizard,
      poolNumber,
      isMultiAz,
      isMachinePool,
      clusterVersion,
      allow500Nodes,
    } = this.props;
    const included = getIncludedNodes({ isMultiAz, isHypershift: !isMachinePool });
    const available = this.getAvailableQuota();

    const optionValueIncrement =
      increment || incrementValue({ isHypershiftWizard, poolNumber, isMultiAz });

    const options = buildOptions({
      included,
      available,
      isEditingCluster,
      currentNodeCount,
      minNodes,
      optionValueIncrement,
      isHypershift: isHypershiftWizard,
      clusterVersion,
      allow500Nodes,
    });

    if (!options.includes(Number(input.value))) {
      // if the value isn't an option, then just set to minNode (the value the user sees as the setting )
      input.onChange(minNodes);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      input,
      isEditingCluster,
      minNodes,
      isHypershiftWizard,
      poolNumber,
      currentNodeCount,
      isMultiAz,
      increment,
      isMachinePool,
      clusterVersion,
      allow500Nodes,
    } = this.props;

    const available = this.getAvailableQuota();
    const included = getIncludedNodes({ isMultiAz, isHypershift: !isMachinePool });
    const optionValueIncrement =
      increment || incrementValue({ isHypershiftWizard, poolNumber, isMultiAz });
    const options = buildOptions({
      included,
      available,
      isEditingCluster,
      currentNodeCount,
      minNodes,
      optionValueIncrement,
      isHypershift: isHypershiftWizard,
      clusterVersion,
      allow500Nodes,
    });

    if (isHypershiftWizard && poolNumber !== prevProps.poolNumber) {
      // Keep value the user sees (nodes per pool) unless the number of total nodes
      // is less than the minimum total nodes
      const prevSelected = (prevProps.input?.value ?? 0) / prevProps.poolNumber || minNodes;
      const newValue = prevSelected * poolNumber;
      if (newValue > minNodes && newValue <= getMaxNodesHCP(clusterVersion, allow500Nodes)) {
        input.onChange(newValue);
      } else {
        input.onChange(minNodes);
      }
    } else if (available === 0 && input.value !== minNodes && !isEditingCluster) {
      // set input value to minimum if we don't have quota for it (and will be disabled)
      // this can happen if the user set a value, then switched to a machine type
      // where they have less quota than that value.
      input.onChange(minNodes);
    }

    if (!options.includes(Number(input.value))) {
      // if the value isn't an option, then just set to minNode (the value the user sees as the setting )
      input.onChange(minNodes);
    }
  }

  getAvailableQuota() {
    const {
      quota,
      isByoc,
      isMultiAz,
      machineType,
      machineTypes,
      cloudProviderID,
      product,
      billingModel,
    } = this.props;

    return getAvailableQuotaUtil({
      quota,
      isByoc,
      billingModel,
      cloudProviderID,
      isMultiAz,
      machineTypes,
      machineTypeId: machineType,
      product,
    });
  }

  render() {
    const {
      input,
      isMultiAz,
      isEditingCluster,
      currentNodeCount,
      label,
      helpText,
      extendedHelpText,
      machineType,
      isByoc,
      isMachinePool,
      minNodes,
      increment,
      isHypershiftWizard,
      poolNumber = isMultiAz ? 3 : 1,
      buttonAriaLabel,
      clusterVersion,
      allow500Nodes,
    } = this.props;

    const optionValueIncrement =
      increment || incrementValue({ isHypershiftWizard, poolNumber, isMultiAz });

    const included = getIncludedNodes({ isMultiAz, isHypershift: !isMachinePool });
    const available = this.getAvailableQuota();

    const options = buildOptions({
      included,
      available,
      isEditingCluster,
      currentNodeCount,
      minNodes,
      increment: optionValueIncrement,
      isHypershift: isHypershiftWizard,
      clusterVersion,
      allow500Nodes,
    });

    let notEnoughQuota = options.length < 1;

    // for BYOC lacking node quota machineType will be undefined
    if (isByoc && !isEditingCluster && !isMachinePool) {
      notEnoughQuota = !machineType || options.length < 1;
    }

    const optionLabel = (value) => {
      let labelNumber = value;
      if (isHypershiftWizard) {
        labelNumber = value / optionValueIncrement;
      } else if (isMultiAz) {
        labelNumber = value / 3;
      }
      return labelNumber.toString();
    };

    // Set up options for nodes
    const option = (value) => (
      <FormSelectOption
        key={value}
        value={value}
        // we want the value to be the actual value sent to the server,
        // but for multiAz the user selects the amount of nodes per zone, instead of total
        // so it needs to be divided by 3 for display
        label={optionLabel(value)}
      />
    );

    const { onChange, ...restInput } = input;

    const formSelect = (
      <FormSelect
        aria-label="Compute nodes"
        isDisabled={notEnoughQuota}
        className="quota-dropdown"
        onChange={(_event, value) => onChange(value)}
        {...restInput}
      >
        {options.map((value) => option(value))}
      </FormSelect>
    );

    const showTotalNodes = () => {
      if (isHypershiftWizard) {
        return (
          <span data-testid="compute-node-hcp-multizone-details">
            x {poolNumber} machine pools = {input.value} compute nodes
          </span>
        );
      }
      return isMultiAz ? (
        <span data-testid="compute-node-multizone-details">
          × 3 zones = {input.value} compute nodes
        </span>
      ) : null;
    };

    return (
      <FormGroup
        fieldId={input.name}
        label={label}
        labelIcon={
          extendedHelpText && (
            <PopoverHint hint={extendedHelpText} buttonAriaLabel={buttonAriaLabel} />
          )
        }
      >
        {notEnoughQuota ? (
          <Tooltip content={noQuotaTooltip} position="right">
            <div>{formSelect}</div>
          </Tooltip>
        ) : (
          formSelect
        )}
        {showTotalNodes()}
        <FormGroupHelperText>{helpText}</FormGroupHelperText>
      </FormGroup>
    );
  }
}

const validateClusterVersion = (props, propName, componentName) => {
  const { isHypershiftWizard } = props;

  if (isHypershiftWizard) {
    if (typeof props[propName] !== 'string') {
      return new Error(
        `Prop \`${propName}\` must be a string when \`isHypershiftWizard\` is true in \`${componentName}\`.`,
      );
    }
    if (!props[propName]) {
      return new Error(
        `Prop \`${propName}\` is required when \`isHypershiftWizard\` is true in \`${componentName}\`.`,
      );
    }
  }

  return null;
};

const validateAllow500Nodes = (props, propName, componentName) => {
  const { isHypershiftWizard } = props;

  if (isHypershiftWizard) {
    if (typeof props[propName] !== 'boolean') {
      return new Error(
        `Prop \`${propName}\` must be a boolean when \`isHypershiftWizard\` is true in \`${componentName}\`.`,
      );
    }
    if (props[propName] === undefined) {
      return new Error(
        `Prop \`${propName}\` is required when \`isHypershiftWizard\` is true in \`${componentName}\`.`,
      );
    }
  }

  return null;
};

NodeCountInput.propTypes = {
  isEditingCluster: PropTypes.bool,
  currentNodeCount: PropTypes.number,
  minNodes: PropTypes.number,
  label: PropTypes.string,
  helpText: PropTypes.string,
  extendedHelpText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  quota: PropTypes.object.isRequired,
  isByoc: PropTypes.bool,
  isMachinePool: PropTypes.bool,
  isMultiAz: PropTypes.bool,
  machineType: PropTypes.string,
  machineTypes: PropTypes.object,
  input: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
  }),
  cloudProviderID: PropTypes.string.isRequired,
  product: PropTypes.oneOf(Object.keys(normalizedProducts)).isRequired,
  billingModel: PropTypes.oneOf(Object.values(billingModels)).isRequired,
  increment: PropTypes.number,
  isHypershiftWizard: PropTypes.bool,
  poolNumber: PropTypes.number,
  buttonAriaLabel: PropTypes.string,
  clusterVersion: validateClusterVersion,
  allow500Nodes: validateAllow500Nodes,
};

export default NodeCountInput;
