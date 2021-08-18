import React from 'react';
import PropTypes from 'prop-types';

import { Button, Tooltip } from '@patternfly/react-core';

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
function ButtonWithTooltip({
  disableReason, isAriaDisabled, tooltipProps = {}, ...buttonProps
}) {
  if (disableReason) {
    return (
      <Tooltip content={disableReason} {...tooltipProps}>
        <Button isAriaDisabled {...buttonProps} />
      </Tooltip>
    );
  }
  return <Button isAriaDisabled={isAriaDisabled} {...buttonProps} />;
}
ButtonWithTooltip.propTypes = {
  disableReason: PropTypes.node,
  isAriaDisabled: PropTypes.bool,
  tooltipProps: PropTypes.object,
};

export default ButtonWithTooltip;
