import React from 'react';
import PropTypes from 'prop-types';

const icon = require('./CostIcon.svg');

const CostIcon = ({ className }) => (
  <img
    className={`ocm--cost-icon ${className}`}
    src={icon.default}
    alt="Cost Management"
    aria-hidden="true"
  />
);

CostIcon.propTypes = {
  className: PropTypes.string,
};

export default CostIcon;
