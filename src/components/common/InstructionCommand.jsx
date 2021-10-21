import React from 'react';
import PropTypes from 'prop-types';
import { ClipboardCopy, Text } from '@patternfly/react-core';

import './InstructionCommand.scss';

const InstructionCommand = ({ children, textAriaLabel }) => (
  <Text component="pre" className="ocm-instructions__command">
    <ClipboardCopy
      isReadOnly
      textAriaLabel={textAriaLabel}
    >
      {children}
    </ClipboardCopy>
  </Text>
);

InstructionCommand.propTypes = {
  children: PropTypes.node,
  textAriaLabel: PropTypes.string,
};

export default InstructionCommand;
