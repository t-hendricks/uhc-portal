import React from 'react';
import { Button, Popover, PopoverProps } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';

import './PopoverHint.scss';

interface PopoverHintProps extends Omit<PopoverProps, 'bodyContent'> {
  hint?: React.ReactNode;
  title?: React.ReactNode;
  iconClassName?: string;
  footer?: React.ReactNode;
  bodyContent?: React.ReactNode | ((hide: () => void) => React.ReactNode);
}

const PopoverHint = ({
  title,
  hint,
  iconClassName,
  footer,
  bodyContent,
  ...popoverProps
}: PopoverHintProps) => (
  <>
    <Popover
      headerContent={title}
      footerContent={footer}
      aria-label="help"
      bodyContent={bodyContent ?? hint}
      {...popoverProps}
    >
      <Button className="popover-hint-button" aria-label="More information" variant="plain">
        <span className={iconClassName}>
          <OutlinedQuestionCircleIcon />
        </span>
      </Button>
    </Popover>
  </>
);

export default PopoverHint;
