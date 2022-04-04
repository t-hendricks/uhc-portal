import PropTypes from 'prop-types';
import React from 'react';
import { Popover } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';

const PopoverHint = ({
  title, hint, iconClassName, ...popoverProps
}) => (
  <>
    <Popover
      headerContent={title}
      bodyContent={hint}
      aria-label="help"
      {...popoverProps}
    >
      <span className={iconClassName}>
        <OutlinedQuestionCircleIcon />
      </span>
    </Popover>
  </>
);

PopoverHint.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]),
  hint: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]).isRequired,
  iconClassName: PropTypes.string,
};

export default PopoverHint;
