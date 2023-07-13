import get from 'lodash/get';
import React from 'react';
import { DropdownItem } from '@patternfly/react-core';
import { isRestrictedEnv } from '~/restrictedEnv';
import clusterStates, { isHibernating } from '../clusterStates';
import { subscriptionStatuses, normalizedProducts } from '../../../../common/subscriptionTypes';
import getClusterName from '../../../../common/getClusterName';
import modals from '../../../common/Modal/modals';
import { isAssistedInstallCluster } from '../../../../common/isAssistedInstallerCluster';
import { isHypershiftCluster } from '../../ClusterDetails/clusterDetailsHelper';

/**
 * Helper using reason message why it's disabled as source-of-truth
 * for whether it should be disabled.
 * This allows easy chaining `disableIfTooltip(reason1 || reason2 || ...)`.
 *
 * @param tooltip - message to show.  If truthy, also returns `isAriaDisabled: true` prop.
 * @param [propsIfEnabled] - return value if `tooltip` was falsy (default {}).
 */
const disableIfTooltip = (tooltip, propsIfEnabled = {}) =>
  // isDisabled blocks mouse events, so tooltip doesn't show on hover.
  // isAriaDisabled solved this, https://github.com/patternfly/patternfly-react/pull/6038.
  tooltip ? { isAriaDisabled: true, tooltip, tooltipProps: { position: 'left' } } : propsIfEnabled;

/**
 * This function is used by PF tables to determine which dropdown items are displayed
 * on each row of the table. It returns a list of objects, containing props for DropdownItem
 * PF table renders automatically.
 * @param {*} cluster             The cluster object corresponding to the current row
 * @param {*} showConsoleButton   true if 'Open Console' button should be displayed
 * @param {*} openModal           Action to open modal
 */
function actionResolver(
  cluster,
  showConsoleButton,
  openModal,
  canSubscribeOCP,
  canTransferClusterOwnership,
  canHibernateCluster,
  toggleSubscriptionReleased,
  refreshFunc,
  inClusterList,
) {
  const baseProps = {
    component: 'button',
  };
  const isClusterUninstalling = cluster.state === clusterStates.UNINSTALLING;
  const uninstallingMessage = isClusterUninstalling && (
    <span>The cluster is being uninstalled</span>
  );
  const isClusterReady = cluster.state === clusterStates.READY;
  // Superset of more specific uninstallingMessage.
  const notReadyMessage = !isClusterReady && <span>This cluster is not ready</span>;
  const isClusterInHibernatingProcess = isHibernating(cluster.state);
  const hibernatingMessage =
    isClusterInHibernatingProcess &&
    (cluster.state === clusterStates.RESUMING ? (
      <>This cluster is resuming; wait for it to be ready in order to perform actions</>
    ) : (
      <>This cluster is hibernating; resume cluster in order to perform actions</>
    ));

  const isClusterHibernatingOrPoweringDown =
    cluster.state === clusterStates.HIBERNATING || cluster.state === clusterStates.POWERING_DOWN;
  const isClusterPoweringDown = cluster.state === clusterStates.POWERING_DOWN;
  const poweringDownMessage = isClusterPoweringDown && (
    <span>
      This cluster is powering down; you will be able to resume after it reaches hibernating state.
    </span>
  );

  const isReadOnly = cluster?.status?.configuration_mode === 'read_only';
  const readOnlyMessage = isReadOnly && (
    <span>This operation is not available during maintenance</span>
  );

  const consoleURL = get(cluster, 'console.url', false);
  const consoleDisabledMessage = !consoleURL && (
    <span>Admin console is not yet available for this cluster</span>
  );

  const getKey = (item) => `${cluster.id}.menu.${item}`;
  const clusterName = getClusterName(cluster);
  const isProductOSDTrial = cluster.product && cluster.product.id === normalizedProducts.OSDTrial;

  const getAdminConsoleProps = () => ({
    ...baseProps,
    title: 'Open console',
    key: getKey('adminconsole'),
    ...disableIfTooltip(uninstallingMessage || hibernatingMessage || consoleDisabledMessage, {
      component: 'a',
      href: consoleURL,
      target: '_blank',
      rel: 'noopener noreferrer',
    }),
  });

  const getHibernateClusterProps = () => {
    const hibernateClusterBaseProps = {
      ...baseProps,
      key: getKey('hibernatecluster'),
    };
    const modalData = {
      clusterID: cluster.id,
      clusterName,
      subscriptionID: cluster.subscription ? cluster.subscription.id : '',
      shouldDisplayClusterName: inClusterList,
    };
    const hibernateClusterProps = {
      ...hibernateClusterBaseProps,
      title: 'Hibernate cluster',
      ...disableIfTooltip(uninstallingMessage || readOnlyMessage || notReadyMessage, {
        onClick: () => openModal(modals.HIBERNATE_CLUSTER, modalData),
      }),
    };
    const resumeHibernatingClusterProps = {
      ...hibernateClusterBaseProps,
      title: 'Resume from Hibernation',
      ...disableIfTooltip(poweringDownMessage || readOnlyMessage, {
        onClick: () => openModal(modals.RESUME_CLUSTER, modalData),
      }),
    };

    if (isClusterHibernatingOrPoweringDown) {
      return resumeHibernatingClusterProps;
    }
    return hibernateClusterProps;
  };

  const getScaleClusterProps = () => ({
    ...baseProps,
    title: 'Edit load balancers and persistent storage',
    key: getKey('scalecluster'),
    ...disableIfTooltip(
      uninstallingMessage || readOnlyMessage || hibernatingMessage || notReadyMessage,
      {
        onClick: () =>
          openModal(modals.SCALE_CLUSTER, { ...cluster, shouldDisplayClusterName: inClusterList }),
      },
    ),
  });

  const getEditNodeCountProps = () => ({
    ...baseProps,
    title: 'Edit node count',
    key: getKey('editnodecount'),
    ...disableIfTooltip(
      uninstallingMessage || readOnlyMessage || hibernatingMessage || notReadyMessage,
      {
        onClick: () =>
          openModal(modals.EDIT_NODE_COUNT, {
            cluster,
            isDefaultMachinePool: !isHypershiftCluster(cluster),
            shouldDisplayClusterName: inClusterList,
            isHypershiftCluster: isHypershiftCluster(cluster),
            clearMachineOrNodePoolsOnExit: true,
          }),
      },
    ),
  });

  const getEditDisplayNameProps = () => ({
    ...baseProps,
    title: 'Edit display name',
    key: getKey('editdisplayname'),
    ...disableIfTooltip(uninstallingMessage, {
      onClick: () =>
        openModal(modals.EDIT_DISPLAY_NAME, {
          ...cluster,
          shouldDisplayClusterName: inClusterList,
        }),
    }),
  });
  const getArchiveClusterProps = () => {
    const baseArchiveProps = {
      ...baseProps,
      title: 'Archive cluster',
      key: getKey('archivecluster'),
    };
    const archiveModalData = {
      subscriptionID: cluster.subscription ? cluster.subscription.id : '',
      name: clusterName,
    };
    return {
      ...baseArchiveProps,
      ...disableIfTooltip(readOnlyMessage, {
        onClick: () =>
          openModal(modals.ARCHIVE_CLUSTER, {
            ...archiveModalData,
            shouldDisplayClusterName: inClusterList,
          }),
      }),
    };
  };

  const getUnarchiveClusterProps = () => {
    const baseArchiveProps = {
      ...baseProps,
      title: 'Unarchive cluster',
      key: getKey('unarchivecluster'),
    };
    const unarchiveModalData = {
      subscriptionID: cluster.subscription ? cluster.subscription.id : '',
      name: clusterName,
    };
    return {
      ...baseArchiveProps,
      ...disableIfTooltip(readOnlyMessage, {
        onClick: () =>
          openModal(modals.UNARCHIVE_CLUSTER, {
            ...unarchiveModalData,
            shouldDisplayClusterName: inClusterList,
          }),
      }),
    };
  };

  const getEditConsoleURLProps = () => ({
    ...baseProps,
    key: getKey('editconsoleurl'),
    ...disableIfTooltip(uninstallingMessage, {
      title: consoleURL ? 'Edit console URL' : 'Add console URL',
      onClick: () =>
        openModal(modals.EDIT_CONSOLE_URL, { ...cluster, shouldDisplayClusterName: inClusterList }),
    }),
  });

  const getDeleteItemProps = () => ({
    ...baseProps,
    title: 'Delete cluster',
    key: getKey('deletecluster'),
    ...disableIfTooltip(uninstallingMessage || readOnlyMessage || hibernatingMessage, {
      onClick: () =>
        openModal(modals.DELETE_CLUSTER, {
          clusterID: cluster.id,
          clusterName,
          shouldDisplayClusterName: inClusterList,
        }),
    }),
  });

  const getEditSubscriptionSettingsProps = () => {
    const editSubscriptionSettingsProps = {
      ...baseProps,
      title: 'Edit subscription settings',
      key: getKey('editsubscriptionsettings'),
      onClick: () =>
        openModal(modals.EDIT_SUBSCRIPTION_SETTINGS, {
          subscription: cluster.subscription,
          shouldDisplayClusterName: inClusterList,
        }),
    };
    return editSubscriptionSettingsProps;
  };

  const getTransferClusterOwnershipProps = () => {
    const isReleased = get(cluster, 'subscription.released', false);
    const title = isReleased ? 'Cancel ownership transfer' : 'Transfer cluster ownership';
    const transferClusterOwnershipProps = {
      ...baseProps,
      title,
      key: getKey('transferclusterownership'),
      onClick: () => {
        if (isReleased) {
          toggleSubscriptionReleased(get(cluster, 'subscription.id'), false);
          refreshFunc();
        } else {
          openModal(modals.TRANSFER_CLUSTER_OWNERSHIP, {
            subscription: cluster.subscription,
            shouldDisplayClusterName: inClusterList,
          });
        }
      },
    };
    return transferClusterOwnershipProps;
  };

  const getUpgradeTrialClusterProps = () => {
    const upgradeTrialClusterData = {
      clusterID: cluster.id,
      cluster,
    };
    const upgradeTrialClusterProps = {
      ...baseProps,
      title: 'Upgrade cluster from Trial',
      key: getKey('upgradetrialcluster'),
    };
    return {
      ...upgradeTrialClusterProps,
      ...disableIfTooltip(readOnlyMessage, {
        onClick: () =>
          openModal(modals.UPGRADE_TRIAL_CLUSTER, {
            ...upgradeTrialClusterData,
            shouldDisplayClusterName: inClusterList,
          }),
      }),
    };
  };

  const adminConsoleItemProps = getAdminConsoleProps();
  const scaleClusterItemProps = getScaleClusterProps();
  const editNodeCountItemProps = getEditNodeCountProps();
  const editDisplayNameItemProps = getEditDisplayNameProps();
  const editConsoleURLItemProps = getEditConsoleURLProps();
  const deleteClusterItemProps = getDeleteItemProps();
  const archiveClusterItemProps = getArchiveClusterProps();
  const unarchiveClusterItemProps = getUnarchiveClusterProps();
  const editSubscriptionSettingsProps = getEditSubscriptionSettingsProps();
  const transferClusterOwnershipProps = getTransferClusterOwnershipProps();
  const upgradeTrialClusterProps = getUpgradeTrialClusterProps();
  const hibernateClusterProps = getHibernateClusterProps();

  const showDelete = cluster.canDelete && cluster.managed;
  const showScale = cluster.canEdit && cluster.managed && !cluster.ccs?.enabled;
  const showHibernateCluster =
    cluster.canEdit &&
    cluster.managed &&
    canHibernateCluster &&
    !isProductOSDTrial &&
    !isHypershiftCluster(cluster);
  const showEditNodeCount = cluster.canEdit && cluster.managed;
  const isArchived = get(cluster, 'subscription.status', false) === subscriptionStatuses.ARCHIVED;
  const showArchive = cluster.canEdit && !cluster.managed && cluster.subscription && !isArchived;
  const showUnarchive = cluster.canEdit && !cluster.managed && cluster.subscription && isArchived;
  const showEditURL =
    !cluster.managed &&
    cluster.canEdit &&
    (showConsoleButton || consoleURL) &&
    !isAssistedInstallCluster(cluster);
  const product = get(cluster, 'subscription.plan.type', '');
  const showEditSubscriptionSettings =
    product === normalizedProducts.OCP && cluster.canEdit && canSubscribeOCP;
  const isAllowedProducts = [normalizedProducts.OCP, normalizedProducts.ARO].includes(product);
  const showTransferClusterOwnership =
    cluster.canEdit &&
    canTransferClusterOwnership &&
    isAllowedProducts &&
    get(cluster, 'subscription.status') !== subscriptionStatuses.ARCHIVED;
  const showUpgradeTrialCluster = isClusterReady && cluster.canEdit && isProductOSDTrial;

  return [
    showConsoleButton && adminConsoleItemProps,
    cluster.canEdit && editDisplayNameItemProps,
    showEditURL && editConsoleURLItemProps,
    showScale && scaleClusterItemProps,
    showEditNodeCount && editNodeCountItemProps,
    showHibernateCluster && hibernateClusterProps,
    showUpgradeTrialCluster && upgradeTrialClusterProps,
    showDelete && deleteClusterItemProps,
    showArchive && archiveClusterItemProps,
    showUnarchive && unarchiveClusterItemProps,
    showEditSubscriptionSettings && editSubscriptionSettingsProps,
    showTransferClusterOwnership && transferClusterOwnershipProps,
  ].filter(Boolean);
}

function dropDownItems({
  cluster,
  showConsoleButton,
  openModal,
  canSubscribeOCP,
  canTransferClusterOwnership,
  canHibernateCluster,
  toggleSubscriptionReleased,
  refreshFunc,
  inClusterList,
}) {
  const actions = actionResolver(
    cluster,
    showConsoleButton,
    openModal,
    canSubscribeOCP,
    canTransferClusterOwnership,
    canHibernateCluster,
    toggleSubscriptionReleased,
    refreshFunc,
    inClusterList,
  );
  const menuItems = actions.map((action) => (
    <DropdownItem {...action}>{action.title}</DropdownItem>
  ));
  return menuItems;
}

export { actionResolver, dropDownItems };
