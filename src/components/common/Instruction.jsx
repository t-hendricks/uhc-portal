import React from 'react';
import PropTypes from 'prop-types';
import { TextListItem } from '@patternfly/react-core';

import './Instruction.scss';

const Instruction = ({ children }) => (
  <TextListItem className="ocm-instructions__list-item">
    <div className="ocm-instructions__list-item-contents">{children}</div>
  </TextListItem>
);

Instruction.propTypes = {
  children: PropTypes.node,
};

export default Instruction;
