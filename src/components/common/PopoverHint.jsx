import PropTypes from 'prop-types';
import React from 'react';
import { Button, Popover } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';

import './PopoverHint.scss';

const PopoverHint = ({
  title, hint, iconClassName, footer, ...popoverProps
}) => (
  <>
    <Popover
      headerContent={title}
      bodyContent={hint}
      footerContent={footer}
      aria-label="help"
      {...popoverProps}
    >
      <Button
        className="popover-hint-button"
        aria-label="More information"
        variant="plain"
      >
        <span className={iconClassName}>
          <OutlinedQuestionCircleIcon />
        </span>
      </Button>

    </Popover>
  </>
);

PopoverHint.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]),
  hint: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]).isRequired,
  footer: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]),
  iconClassName: PropTypes.string,
};

export default PopoverHint;
