import React from 'react';
import PropTypes from 'prop-types';
import {
  FormSelect,
  FormSelectOption,
  FormGroup,
} from '@patternfly/react-core';
import get from 'lodash/get';

import PopoverHint from '../../../common/PopoverHint';

function NodeCountInput(props) {
  const {
    input, quota, isMultiAz, isByoc, machineType, isDisabled,
    label, helpText, extendedHelpText,
  } = props;
  const minimum = isMultiAz ? 9 : 4;
  const infraType = isByoc ? 'byoc' : 'rhInfra';
  const zoneType = isMultiAz ? 'multiAz' : 'singleAz';
  const available = get(quota, `${infraType}.${zoneType}['${machineType}']`, 0);
  // no extra node quota = only base cluster size is available
  const options = available === 0 ? [minimum] : [];
  // MultiAz requires nodes to be a multiple of 3
  const increment = isMultiAz ? 3 : 1;
  for (let i = minimum; i <= available; i += increment) {
    options.push(i);
  }
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
  return (
    <FormGroup
      fieldId={input.name}
      label={label}
      helperText={helpText}
      className="compute-nodes-select"
    >
      { extendedHelpText && (
        <PopoverHint hint={extendedHelpText} />
      )}
      <div>
        <FormSelect
          aria-label="Compute nodes"
          isDisabled={isDisabled || available === 0}
          {...input}
        >
          {options.map(value => option(value))}
        </FormSelect>
        { isMultiAz && (
        <span>
          × 3 zones =
          {' '}
          {input.value}
          {' '}
          compute nodes
        </span>
        )}
      </div>
    </FormGroup>
  );
}

NodeCountInput.propTypes = {
  isDisabled: PropTypes.bool,
  label: PropTypes.string,
  helpText: PropTypes.string,
  extendedHelpText: PropTypes.string,
  quota: PropTypes.shape({
    byoc: PropTypes.object,
    rhInfra: PropTypes.object,
  }).isRequired,
  isByoc: PropTypes.bool,
  isMultiAz: PropTypes.bool,
  machineType: PropTypes.string,
  input: PropTypes.object,
};

export default NodeCountInput;
