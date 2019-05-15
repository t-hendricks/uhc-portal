
import React from 'react';
import PropTypes from 'prop-types';

import { humanizeValueWithUnit } from '../../../../../common/units';

function NumberWithUnit({ valueWithUnit, unitOverride, isBytes }) {
  let { value } = valueWithUnit;
  let unit;
  if (unitOverride !== null) {
    unit = unitOverride;
  } else {
    ({ unit } = valueWithUnit);
  }
  if (isBytes) {
    const humainzed = humanizeValueWithUnit(value, unit);
    ({ value, unit } = humainzed);
  }
  return (
    <span>
      { value }
      <span style={{
        fontSize: 'smaller',
        marginLeft: '0.2em',
        color: 'gray',
      }}
      >
        { unit }
      </span>
    </span>);
}

NumberWithUnit.propTypes = {
  valueWithUnit: PropTypes.shape({
    value: PropTypes.number.isRequired,
    unit: PropTypes.string.isRequired,
  }).isRequired,
  unitOverride: PropTypes.string,
  isBytes: PropTypes.bool,
};

NumberWithUnit.defaultProps = {
  isBytes: false,
  unitOverride: null,
};

export default NumberWithUnit;
