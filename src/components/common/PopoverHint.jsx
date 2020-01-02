import PropTypes from 'prop-types';
import React from 'react';
import { Popover } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';

const PopoverHint = ({ hint }) => (
  <>
    { ' ' }
    <Popover
      bodyContent={hint}
      aria-label="help"
    >
      <OutlinedQuestionCircleIcon />
    </Popover>
  </>
);
PopoverHint.propTypes = {
  hint: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]).isRequired,
};

export default PopoverHint;
