import get from 'lodash/get';
import React from 'react';
import { DropdownItem } from '@patternfly/react-core';
import clusterStates from '../clusterStates';
import { subscriptionStatuses, subscriptionPlans } from '../../../../common/subscriptionTypes';
import getClusterName from '../../../../common/getClusterName';

/**
 * This function is used by PF tables to determine which dropdown items are displayed
 * on each row of the table. It returns a list of objects, containing props for DropdownItem
 * PF table renders automatically.
 * @param {*} cluster             The cluster object corresponding to the current row
 * @param {*} showConsoleButton   true if 'Open Console' button should be displayed
 * @param {*} openModal           Action to open modal
 */
function actionResolver(
  cluster, showConsoleButton, openModal, canAllowClusterAdmin, canSubscribeOCP,
  canTransferClusterOwnership, toggleSubscriptionReleased,
) {
  const baseProps = {
    component: 'button',
  };
  const uninstallingMessage = <span>The cluster is being uninstalled</span>;
  const consoleDisabledMessage = <span>Admin console is not yet available for this cluster</span>;
  const notReadyMessage = <span>This cluster is not ready</span>;
  const isClusterUninstalling = cluster.state === clusterStates.UNINSTALLING;
  const isClusterReady = cluster.state === clusterStates.READY;
  const isClusterErrorInAccountClaimPhase = cluster.state === clusterStates.ERROR
  && !cluster.status.dns_ready;
  const hasAccountId = cluster.managed && cluster.aws && cluster.aws.account_id;
  const isUninstallingProps = isClusterUninstalling
    ? { isDisabled: true, tooltip: uninstallingMessage } : {};
  const getKey = item => `${cluster.id}.menu.${item}`;
  const clusterName = getClusterName(cluster);

  const getAdminConosleProps = () => {
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
    return consoleURL && !isClusterUninstalling ? adminConsoleEnabled : adminConsoleDisabled;
  };

  const getScaleClusterProps = () => {
    const scaleClusterBaseProps = {
      ...baseProps,
      title: 'Edit load balancers and persistent storage',
      key: getKey('scalecluster'),
    };
    const managedEditProps = {
      ...scaleClusterBaseProps,
      onClick: () => openModal('edit-cluster', cluster),
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
      onClick: () => openModal('edit-node-count', { cluster, isDefaultMachinePool: true }),
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
      onClick: () => openModal('edit-ccs-credentials', cluster),
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
      onClick: () => openModal('edit-display-name', cluster),
    };
    const editDisplayNamePropsUninstalling = {
      ...editDisplayNameBaseProps,
      ...isUninstallingProps,
    };
    return isClusterUninstalling ? editDisplayNamePropsUninstalling : editDisplayNameProps;
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
    return { ...baseArchiveProps, onClick: () => openModal('archive-cluster', archiveModalData) };
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
    return { ...baseArchiveProps, onClick: () => openModal('unarchive-cluster', unarchiveModalData) };
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
      onClick: () => openModal('edit-console-url', cluster),
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
    return isClusterUninstalling
      ? { ...baseDeleteProps, ...isUninstallingProps }
      : { ...baseDeleteProps, onClick: () => openModal('delete-cluster', deleteModalData) };
  };

  const getEditSubscriptionSettingsProps = () => {
    const editSubscriptionSettingsProps = {
      ...baseProps,
      title: 'Edit subscription settings',
      key: getKey('editsubscriptionsettings'),
      onClick: () => openModal('edit-subscription-settings', cluster.subscription),
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
        } else {
          openModal('transfer-cluster-ownership', cluster.subscription);
        }
      },
    };
    return transferClusterOwnershipProps;
  };

  const getToggleClusterAdminAccessDialogProps = () => (
    {
      ...baseProps,
      title: !cluster.cluster_admin_enabled ? 'Allow cluster-admin access' : 'Remove cluster-admin access',
      key: getKey('allowclusteradmin'),
      onClick: () => openModal('allow-cluster-admin', cluster),
      ...isUninstallingProps,
    }
  );

  const adminConsoleItemProps = getAdminConosleProps();
  const scaleClusterItemProps = getScaleClusterProps();
  const editNodeCountItemProps = getEditNodeCountProps();
  const editDisplayNameItemProps = getEditDisplayNameProps();
  const editConsoleURLItemProps = getEditConsoleURLProps();
  const deleteClusterItemProps = getDeleteItemProps();
  const archiveClusterItemProps = getArchiveClusterProps();
  const unarchiveClusterItemProps = getUnarchiveClusterProps();
  const editSubscriptionSettingsProps = getEditSubscriptionSettingsProps();
  const transferClusterOwnershipProps = getTransferClusterOwnershipProps();
  const ToggleClusterAdminAccessDialogProps = getToggleClusterAdminAccessDialogProps();
  const editccscredentialsProps = getEditCCSCredentialsProps();
  const showDelete = cluster.canDelete && cluster.managed;
  const showScale = cluster.canEdit && cluster.managed && !cluster.ccs?.enabled;
  const showEditNodeCount = cluster.canEdit && cluster.managed;
  const isArchived = get(cluster, 'subscription.status', false) === subscriptionStatuses.ARCHIVED;
  const showArchive = cluster.canEdit && !cluster.managed && cluster.subscription
    && !isArchived;
  const showUnarchive = cluster.canEdit && !cluster.managed && cluster.subscription
    && isArchived;
  const showEditURL = !cluster.managed && cluster.canEdit && (showConsoleButton || hasConsoleURL);
  const showEditSubscriptionSettings = !cluster.managed && cluster.canEdit && canSubscribeOCP;
  const showTransferClusterOwnership = cluster.canEdit && canTransferClusterOwnership && get(cluster, 'subscription.plan.id', false) === subscriptionPlans.OCP
    && get(cluster, 'subscription.status') !== subscriptionStatuses.ARCHIVED;
  const showToggleClusterAdmin = cluster.managed && canAllowClusterAdmin;
  const showccscredentials = cluster.ccs?.enabled;
  return [
    showConsoleButton && adminConsoleItemProps,
    cluster.canEdit && editDisplayNameItemProps,
    showEditURL && editConsoleURLItemProps,
    showScale && scaleClusterItemProps,
    showEditNodeCount && editNodeCountItemProps,
    showDelete && deleteClusterItemProps,
    showArchive && archiveClusterItemProps,
    showUnarchive && unarchiveClusterItemProps,
    showEditSubscriptionSettings && editSubscriptionSettingsProps,
    showTransferClusterOwnership && transferClusterOwnershipProps,
    showToggleClusterAdmin && ToggleClusterAdminAccessDialogProps,
    showccscredentials && editccscredentialsProps,
  ].filter(Boolean);
}

function dropDownItems({
  cluster, showConsoleButton, openModal, canAllowClusterAdmin, canSubscribeOCP,
  canTransferClusterOwnership, toggleSubscriptionReleased,
}) {
  const actions = actionResolver(
    cluster, showConsoleButton, openModal, canAllowClusterAdmin, canSubscribeOCP,
    canTransferClusterOwnership, toggleSubscriptionReleased,
  );
  const menuItems = actions.map(
    action => (<DropdownItem {...action}>{action.title}</DropdownItem>),
  );
  return menuItems;
}

export { actionResolver, dropDownItems };
