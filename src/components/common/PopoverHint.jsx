import PropTypes from 'prop-types';
import React from 'react';
import { Popover } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';

const PopoverHint = ({ hint }) => (
  <React.Fragment>
    { ' ' }
    <Popover
      bodyContent={hint}
      aria-label="help"
    >
      <OutlinedQuestionCircleIcon />
    </Popover>
  </React.Fragment>
);
PopoverHint.propTypes = {
  hint: PropTypes.string.isRequired,
};

export default PopoverHint;
