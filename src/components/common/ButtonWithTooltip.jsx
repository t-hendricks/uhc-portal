import React from 'react';
import PropTypes from 'prop-types';

import { Button, Tooltip } from '@patternfly/react-core';

/**
 * Helper using reason why button is disabled as source-of-truth for whether it should be disabled.
 * This allows easy chaining `disableReason={reason1 || reason2 || ...}`.
 *
 * Will disable and show tooltip iff `disableReason` is truthy.
 * Value can be "node-like", including string.
 * Shows normal active button for all falsy values (missing/undefined, false etc.).
 *
 * All other props passed down to Button.
 */
function ButtonWithTooltip({ disableReason, ...buttonProps }) {
  if (disableReason) {
    // span is workaround for https://github.com/patternfly/patternfly-react/issues/1894.
    // Without it, tooltip triggers on the button component itself, and won't show
    // due to `pointer-events: none` style on disabled buttons.
    // This might not be best workaround, should check accessibility, see
    // https://github.com/patternfly/patternfly-react/issues/1894#issuecomment-596714910
    return (
      <Tooltip content={disableReason}>
        <span>
          <Button isDisabled {...buttonProps} />
        </span>
      </Tooltip>
    );
  }
  return <Button {...buttonProps} />;
}
ButtonWithTooltip.propTypes = {
  disableReason: PropTypes.node,
};

export default ButtonWithTooltip;
