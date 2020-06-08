import React from 'react';
import clusterStates from '../../clusters/common/clusterStates';

/**
 * This function is used by PF tables to determine which dropdown items are displayed
 * on each row of the table. It returns a list of objects, containing props for DropdownItem
 * PF table renders automatically.
 * @param {*} cluster             The cluster object corresponding to the current row
 */
function actionResolver(
  cluster,
) {
  const baseProps = {
    component: 'button',
  };
  const uninstallingMessage = <span>The cluster is being uninstalled</span>;
  const consoleDisabledMessage = <span>Admin console is not yet available for this cluster</span>;
  const isClusterUninstalling = cluster.state === clusterStates.UNINSTALLING;
  const getKey = item => `${cluster.id}.menu.${item}`;
  const consoleURL = cluster.console ? cluster.console.url : false;
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
    tooltip: isClusterUninstalling ? uninstallingMessage : consoleDisabledMessage,
    key: getKey('adminconsole'),
  };
  const consoleItemProps = consoleURL
   && !isClusterUninstalling ? adminConsoleEnabled : adminConsoleDisabled;

  return [consoleItemProps];
}

export { actionResolver };

export default actionResolver;
