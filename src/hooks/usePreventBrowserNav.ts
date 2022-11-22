import React from 'react';

/**
 * Conditionally override default browser behavior what occurs when the document
 * is to be unloaded and show browser prompts when that condition is true.
 * https://github.com/remix-run/history/blob/main/docs/blocking-transitions.md#caveats
 *
 * @param {Boolean} when condition in which the confirmation dialog should appear. Defaults to true.
 */
const usePreventBrowserNav = (when = true) => {
  React.useEffect(() => {
    if (when) {
      window.onbeforeunload = () => {
        // Don't trigger dialogs when elements with download attributes are clicked
        if (!document.activeElement?.hasAttribute('download')) {
          return true;
        }

        return null;
      };
    } else {
      window.onbeforeunload = null;
    }

    // Reset onbeforeunload window event on unmount so that browser confirmation
    // dialogs do not appear outside of this component.
    return () => {
      window.onbeforeunload = null;
    };
  }, [when]);
};

export default usePreventBrowserNav;
