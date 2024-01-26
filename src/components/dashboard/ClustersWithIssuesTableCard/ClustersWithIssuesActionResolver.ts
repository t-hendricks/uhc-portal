import { Subscription } from '~/types/accounts_mgmt.v1';

/**
 * This function is used by PF tables to determine which dropdown items are displayed
 * on each row of the table. It returns a list of objects, containing props for DropdownItem
 * PF table renders automatically.
 * @param {*} subscription             The subscription object corresponding to the current row
 */
function actionResolver(subscription: Subscription) {
  const baseProps = {
    title: 'Open console',
    key: `${subscription.id}.menu.adminconsole`,
  };

  const consoleURL = subscription.console_url;

  let consoleActionProps;
  if (consoleURL) {
    consoleActionProps = {
      ...baseProps,
      to: consoleURL,
      isExternalLink: true,
      rel: 'noopener noreferrer',
    };
  } else {
    consoleActionProps = {
      ...baseProps,
      component: 'button',
      isAriaDisabled: true,
      tooltipProps: {
        content: 'Admin console is not yet available for this cluster',
      },
    };
  }
  return [consoleActionProps];
}

export { actionResolver };

export default actionResolver;
