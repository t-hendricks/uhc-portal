import React from 'react';

import { Button, Tooltip } from '@patternfly/react-core';

type Props = {
  disableReason?: React.ComponentProps<typeof Tooltip>['content'];
  isAriaDisabled?: boolean;
  tooltipProps?: Omit<React.ComponentProps<typeof Tooltip>, 'content'>;
} & React.ComponentProps<typeof Button>;

/**
 * Helper using reason why button is disabled as source-of-truth for whether it should be disabled.
 * This allows easy chaining `disableReason={reason1 || reason2 || ...}`.
 *
 * Will disable and show tooltip iff `disableReason` is truthy.
 * Value can be "node-like", including string.
 * Shows normal button for all falsy values (missing/undefined, false etc.).
 *
 * Will also disable if `isAriaDisabled` is true (but prefer giving a reason when possible).
 *
 * Can optionally specify `tooltipProps` to pass to Tooltip;
 * all other props (including children) passed down to Button.
 */
const ButtonWithTooltip = ({
  disableReason,
  isAriaDisabled,
  tooltipProps = {},
  ...buttonProps
}: Props) => {
  if (disableReason) {
    return (
      <Tooltip {...tooltipProps} content={disableReason}>
        <Button isAriaDisabled {...buttonProps} />
      </Tooltip>
    );
  }
  return <Button isAriaDisabled={isAriaDisabled} {...buttonProps} />;
};

export default ButtonWithTooltip;
