import React from 'react';
import { Button, Popover, PopoverProps, Text, TextVariants } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import './PopoverHintWithTitle.scss';

interface PopoverHintProps extends Omit<PopoverProps, 'bodyContent'> {
  title: string;
  footer?: React.ReactNode;
  bodyContent?: React.ReactNode | ((hide: () => void) => React.ReactNode);
}

const PopoverHintWithTitle = ({
  title,
  bodyContent,
  footer,
  ...popoverProps
}: PopoverHintProps) => (
  <div className="popover-with-title-div">
    <Text component={TextVariants.p}>
      <Popover bodyContent={bodyContent} footerContent={footer} aria-label="help" {...popoverProps}>
        <Button
          className="popover-with-title-button"
          aria-label={`More information on ${title}`}
          variant="plain"
        >
          <span className="popover-with-title-span">
            <OutlinedQuestionCircleIcon />
            {` ${title}`}
          </span>
        </Button>
      </Popover>
    </Text>
  </div>
);

export default PopoverHintWithTitle;
