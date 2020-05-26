import PropTypes from 'prop-types';
import React from 'react';
import { Popover } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';

const PopoverHint = ({ hint, iconClassName }) => (
  <>
    { ' ' }
    <Popover
      bodyContent={hint}
      aria-label="help"
    >
      <span className={iconClassName}>
        <OutlinedQuestionCircleIcon />
      </span>
    </Popover>
  </>
);

PopoverHint.propTypes = {
  hint: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]).isRequired,
  iconClassName: PropTypes.string,
};

export default PopoverHint;
