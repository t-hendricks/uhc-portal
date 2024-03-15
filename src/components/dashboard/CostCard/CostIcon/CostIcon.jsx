import React from 'react';
import PropTypes from 'prop-types';

import CostIconImg from './CostIcon.svg';

const CostIcon = ({ className }) => (
  <img
    className={`ocm--cost-icon ${className}`}
    src={CostIconImg}
    alt="Cost Management"
    aria-hidden="true"
  />
);

CostIcon.propTypes = {
  className: PropTypes.string,
};

export default CostIcon;
