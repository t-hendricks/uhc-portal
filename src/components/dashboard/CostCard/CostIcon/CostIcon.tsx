import React from 'react';

import CostIconImg from './CostIcon.svg';

type CostIconProps = {
  className: string;
};

const CostIcon = ({ className }: CostIconProps) => (
  <img
    className={`ocm--cost-icon ${className}`}
    src={CostIconImg}
    alt="Cost Management"
    aria-hidden="true"
  />
);

export default CostIcon;
