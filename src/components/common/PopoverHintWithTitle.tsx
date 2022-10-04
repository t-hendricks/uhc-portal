import React from 'react';
import { Button, Popover, PopoverProps, Text, TextVariants } from '@patternfly/react-core';
import {ExclamationCircleIcon, OutlinedQuestionCircleIcon} from '@patternfly/react-icons';
import './PopoverHintWithTitle.scss';

interface PopoverHintProps extends Omit<PopoverProps, 'bodyContent'> {
  title: string;
  footer?: React.ReactNode;
  bodyContent?: React.ReactNode | ((hide: () => void) => React.ReactNode);
  isErrorHint?: boolean;
}

const PopoverHintWithTitle = ({
  title,
  bodyContent,
  footer,
  isErrorHint,
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
            {isErrorHint ? (
                <Button isInline variant="link">
                  <ExclamationCircleIcon className="status-icon danger" />
                  {` ${title}`}
                </Button>
            ) : (
                <>
                  <OutlinedQuestionCircleIcon />
                  {` ${title}`}
                </>
            )
            }
          </span>
        </Button>
      </Popover>
    </Text>
  </div>
);

export default PopoverHintWithTitle;
