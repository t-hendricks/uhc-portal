import React from 'react';

/**
 * This function is used by PF tables to determine which dropdown items are displayed
 * on each row of the table. It returns a list of objects, containing props for DropdownItem
 * PF table renders automatically.
 * @param {*} subscription             The subscription object corresponding to the current row
 */
function actionResolver(
  subscription,
) {
  const baseProps = {
    component: 'button',
  };
  const consoleDisabledMessage = <span>Admin console is not yet available for this cluster</span>;
  const getKey = item => `${subscription.id}.menu.${item}`;
  const consoleURL = subscription.console_url;
  const adminConsoleEnabled = {
    component: 'a',
    title: 'Open console',
    href: consoleURL,
    target: '_blank',
    rel: 'noopener noreferrer',
    key: getKey('adminconsole'),
  };
  const adminConsoleDisabled = {
    ...baseProps,
    title: 'Open console',
    isDisabled: true,
    tooltip: consoleDisabledMessage,
    key: getKey('adminconsole'),
  };
  const consoleItemProps = consoleURL ? adminConsoleEnabled : adminConsoleDisabled;

  return [consoleItemProps];
}

export { actionResolver };

export default actionResolver;
