import React from 'react';
import PropTypes from 'prop-types';
import { TextListItem } from '@patternfly/react-core';

import './Instruction.scss';

const Instruction = ({ children, simple }) => (
  <TextListItem
    className={simple ? 'ocm-instructions__list-item-simple' : 'ocm-instructions__list-item'}
  >
    <div className="ocm-instructions__list-item-contents">{children}</div>
  </TextListItem>
);

Instruction.propTypes = {
  children: PropTypes.node,
  simple: PropTypes.bool,
};

export default Instruction;
