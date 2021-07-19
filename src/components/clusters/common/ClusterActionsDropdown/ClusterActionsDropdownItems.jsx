import get from 'lodash/get';
import React from 'react';
import { DropdownItem } from '@patternfly/react-core';
import clusterStates, { isHibernating } from '../clusterStates';
import { subscriptionStatuses, normalizedProducts } from '../../../../common/subscriptionTypes';
import getClusterName from '../../../../common/getClusterName';
import modals from '../../../common/Modal/modals';
import { isAssistedInstallCluster } from '../../../../common/isAssistedInstallerCluster';

/**
 * This function is used by PF tables to determine which dropdown items are displayed
 * on each row of the table. It returns a list of objects, containing props for DropdownItem
 * PF table renders automatically.
 * @param {*} cluster             The cluster object corresponding to the current row
 * @param {*} showConsoleButton   true if 'Open Console' button should be displayed
 * @param {*} openModal           Action to open modal
 */
function actionResolver(
  cluster, showConsoleButton, openModal, canSubscribeOCP,
  canTransferClusterOwnership, canHibernateCluster,
  toggleSubscriptionReleased, refreshFunc,
) {
  const baseProps = {
    component: 'button',
  };
  const uninstallingMessage = <span>The cluster is being uninstalled</span>;
  const consoleDisabledMessage = <span>Admin console is not yet available for this cluster</span>;
  const notReadyMessage = <span>This cluster is not ready</span>;
  const hibernatingMessage = (
    <span>
      This cluster is hibernating;
      awaken cluster in order to perform actions
    </span>
  );
  const isClusterUninstalling = cluster.state === clusterStates.UNINSTALLING;
  const isClusterInHibernatingProcess = isHibernating(cluster.state);
  const isClusterInHibernatingProcessProps = isClusterInHibernatingProcess
    ? { isDisabled: true, tooltip: hibernatingMessage } : {};
  const isClusterHibernatingOrPoweringDown = cluster.state === clusterStates.HIBERNATING
  || cluster.state === clusterStates.POWERING_DOWN;
  const isClusterPoweringDown = cluster.state === clusterStates.POWERING_DOWN;
  const isClusterReady = cluster.state === clusterStates.READY;
  const isClusterErrorInAccountClaimPhase = cluster.state === clusterStates.ERROR
  // eslint-disable-next-line camelcase
  && !cluster.status?.dns_ready;
  const hasAccountId = cluster.managed && cluster.aws && cluster.aws.account_id;
  const isUninstallingProps = isClusterUninstalling
    ? { isDisabled: true, tooltip: uninstallingMessage } : {};
  const getKey = item => `${cluster.id}.menu.${item}`;
  const clusterName = getClusterName(cluster);
  const isProductOSDTrial = cluster.product
                         && cluster.product.id === normalizedProducts.OSDTrial;

  const getAdminConsoleProps = () => {
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
    return consoleURL && !isClusterUninstalling
       && !isClusterInHibernatingProcess ? adminConsoleEnabled : adminConsoleDisabled;
  };

  const getHibernateClusterProps = () => {
    const hibernateClusterBaseProps = {
      ...baseProps,
      key: getKey('hibernatecluster'),
    };
    const clusterData = {
      clusterID: cluster.id,
      clusterName,
      subscriptionID: cluster.subscription ? cluster.subscription.id : '',
    };
    const hibernateClusterProps = {
      ...hibernateClusterBaseProps,
      title: 'Hibernate cluster',
      isDisabled: !isClusterReady,
      onClick: () => openModal(modals.HIBERNATE_CLUSTER, clusterData),
    };
    const resumeHibernatingClusterProps = {
      ...hibernateClusterBaseProps,
      isDisabled: isClusterPoweringDown,
      title: 'Resume from Hibernation',
      onClick: () => openModal(modals.RESUME_CLUSTER, clusterData),
    };

    if (isClusterHibernatingOrPoweringDown) {
      return resumeHibernatingClusterProps;
    }
    return hibernateClusterProps;
  };

  const getScaleClusterProps = () => {
    const scaleClusterBaseProps = {
      ...baseProps,
      title: 'Edit load balancers and persistent storage',
      key: getKey('scalecluster'),
    };
    const managedEditProps = {
      ...scaleClusterBaseProps,
      onClick: () => openModal(modals.SCALE_CLUSTER, cluster),
    };
    const disabledManagedEditProps = {
      ...scaleClusterBaseProps,
      isDisabled: true,
      tooltip: isClusterUninstalling ? uninstallingMessage : notReadyMessage,
    };
    return isClusterReady ? managedEditProps : disabledManagedEditProps;
  };

  const getEditNodeCountProps = () => {
    const editNodeCountBaseProps = {
      ...baseProps,
      title: 'Edit node count',
      key: getKey('editnodecount'),
    };
    const managedEditNodeCountProps = {
      ...editNodeCountBaseProps,
      onClick: () => openModal(modals.EDIT_NODE_COUNT, { cluster, isDefaultMachinePool: true }),
    };
    const disabledManagedEditProps = {
      ...editNodeCountBaseProps,
      isDisabled: true,
      tooltip: isClusterUninstalling ? uninstallingMessage : notReadyMessage,
    };
    return isClusterReady ? managedEditNodeCountProps : disabledManagedEditProps;
  };

  const getEditCCSCredentialsProps = () => {
    const editCCSCredentialsBaseProps = {
      ...baseProps,
      title: 'Edit AWS credentials',
      key: getKey('editccscredentials'),
    };
    const managedEditProps = {
      ...editCCSCredentialsBaseProps,
      onClick: () => openModal(modals.EDIT_CCS_CREDENTIALS, cluster),
    };
    const disabledManagedEditProps = {
      ...editCCSCredentialsBaseProps,
      isDisabled: true,
      tooltip: isClusterUninstalling ? uninstallingMessage : notReadyMessage,
    };
    return !isClusterErrorInAccountClaimPhase && !isClusterUninstalling && hasAccountId
      ? managedEditProps : disabledManagedEditProps;
  };

  const getEditDisplayNameProps = () => {
    const editDisplayNameBaseProps = {
      ...baseProps,
      title: 'Edit display Name',
      key: getKey('editdisplayname'),
    };
    const editDisplayNameProps = {
      ...editDisplayNameBaseProps,
      title: 'Edit display name',
      onClick: () => openModal(modals.EDIT_DISPLAY_NAME, cluster),
    };
    const editDisplayNamePropsUninstalling = {
      ...editDisplayNameBaseProps,
      ...isUninstallingProps,
    };
    const editDisplayNamePropsHibernating = {
      ...editDisplayNameBaseProps,
      ...isClusterInHibernatingProcessProps,
    };

    if (isClusterUninstalling) {
      return editDisplayNamePropsUninstalling;
    } if (isClusterInHibernatingProcess) {
      return editDisplayNamePropsHibernating;
    }
    return editDisplayNameProps;
  };
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
      onClick: () => openModal(modals.ARCHIVE_CLUSTER, archiveModalData),
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
      onClick: () => openModal(modals.UNARCHIVE_CLUSTER, unarchiveModalData),
    };
  };

  const hasConsoleURL = get(cluster, 'console.url', false);

  const getEditConsoleURLProps = () => {
    const editConsoleURLBaseProps = {
      ...baseProps,
      key: getKey('editconsoleurl'),
    };
    const editConsoleURLProps = {
      title: hasConsoleURL ? 'Edit console URL' : 'Add console URL',
      ...editConsoleURLBaseProps,
      onClick: () => openModal(modals.EDIT_CONSOLE_URL, cluster),
    };
    const editConsoleURLPropsUninstalling = {
      ...editConsoleURLBaseProps,
      ...isUninstallingProps,
    };
    return isClusterUninstalling ? editConsoleURLPropsUninstalling : editConsoleURLProps;
  };

  const getDeleteItemProps = () => {
    const baseDeleteProps = {
      ...baseProps,
      title: 'Delete cluster',
      key: getKey('deletecluster'),
    };
    const deleteModalData = {
      clusterID: cluster.id,
      clusterName,
    };

    if (isClusterUninstalling) {
      return { ...baseDeleteProps, ...isUninstallingProps };
    } if (isClusterInHibernatingProcess) {
      return { ...baseDeleteProps, ...isClusterInHibernatingProcessProps };
    }
    return { ...baseDeleteProps, onClick: () => openModal(modals.DELETE_CLUSTER, deleteModalData) };
  };

  const getEditSubscriptionSettingsProps = () => {
    const editSubscriptionSettingsProps = {
      ...baseProps,
      title: 'Edit subscription settings',
      key: getKey('editsubscriptionsettings'),
      onClick: () => openModal(modals.EDIT_SUBSCRIPTION_SETTINGS, cluster.subscription),
    };
    return editSubscriptionSettingsProps;
  };

  const getTransferClusterOwnershipProps = () => {
    const isReleased = get(cluster, 'subscription.released', false);
    const title = isReleased
      ? 'Cancel ownership transfer'
      : 'Transfer cluster ownership';
    const transferClusterOwnershipProps = {
      ...baseProps,
      title,
      key: getKey('transferclusterownership'),
      onClick: () => {
        if (isReleased) {
          toggleSubscriptionReleased(get(cluster, 'subscription.id'), false);
          refreshFunc();
        } else {
          openModal(modals.TRANSFER_CLUSTER_OWNERSHIP, cluster.subscription);
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
      onClick: () => openModal(modals.UPGRADE_TRIAL_CLUSTER, upgradeTrialClusterData),
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
  const editccscredentialsProps = getEditCCSCredentialsProps();
  const hibernateClusterProps = getHibernateClusterProps();

  const showDelete = cluster.canDelete && cluster.managed;
  const showScale = cluster.canEdit && cluster.managed && !cluster.ccs?.enabled;
  const showHibernateCluster = cluster.canEdit && cluster.managed && canHibernateCluster
    && !isProductOSDTrial;
  const showEditNodeCount = cluster.canEdit && cluster.managed;
  const isArchived = get(cluster, 'subscription.status', false) === subscriptionStatuses.ARCHIVED;
  const showArchive = cluster.canEdit && !cluster.managed && cluster.subscription
    && !isArchived;
  const showUnarchive = cluster.canEdit && !cluster.managed && cluster.subscription
    && isArchived;
  const showEditURL = !cluster.managed && cluster.canEdit && (showConsoleButton || hasConsoleURL)
    && !isAssistedInstallCluster(cluster);
  const product = get(cluster, 'subscription.plan.type', '');
  const showEditSubscriptionSettings = product === normalizedProducts.OCP
    && cluster.canEdit && canSubscribeOCP;
  const isAllowedProducts = [normalizedProducts.OCP, normalizedProducts.ARO].includes(product);
  const showTransferClusterOwnership = cluster.canEdit && canTransferClusterOwnership
    && isAllowedProducts
    && get(cluster, 'subscription.status') !== subscriptionStatuses.ARCHIVED;
  // eslint-disable-next-line max-len
  // const showccscredentials = cluster.ccs?.enabled && cluster.cloud_provider && cluster.cloud_provider.id !== 'gcp';
  const showccscredentials = false; // Temporary until backend is fixed
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
    showccscredentials && editccscredentialsProps,
  ].filter(Boolean);
}

function dropDownItems({
  cluster, showConsoleButton, openModal, canSubscribeOCP,
  canTransferClusterOwnership, canHibernateCluster,
  toggleSubscriptionReleased, refreshFunc,
}) {
  const actions = actionResolver(
    cluster, showConsoleButton, openModal, canSubscribeOCP,
    canTransferClusterOwnership, canHibernateCluster,
    toggleSubscriptionReleased, refreshFunc,
  );
  const menuItems = actions.map(
    action => (<DropdownItem {...action}>{action.title}</DropdownItem>),
  );
  return menuItems;
}

export { actionResolver, dropDownItems };
