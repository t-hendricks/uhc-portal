import get from 'lodash/get';
import React from 'react';
import { DropdownItem } from '@patternfly/react-core';
import clusterStates from '../clusterStates';
import { subscriptionStatuses } from '../../../../common/subscriptionTypes';
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
  cluster, showConsoleButton, openModal, canAllowClusterAdmin,
) {
  const baseProps = {
    component: 'button',
  };
  const uninstallingMessage = <span>The cluster is being uninstalled</span>;
  const consoleDisabledMessage = <span>Admin console is not yet available for this cluster</span>;
  const notReadyMessage = <span>This cluster is not ready</span>;
  const isClusterUninstalling = cluster.state === clusterStates.UNINSTALLING;
  const isClusterReady = cluster.state === clusterStates.READY;
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
      title: 'Scale cluster',
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

  const getEditDisconnectedClusterProps = () => (
    {
      ...baseProps,
      title: 'Edit cluster registration',
      key: getKey('editdisconnected'),
      onClick: () => openModal('edit-disconnected-cluster', cluster),
    }
  );

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
      clusterName: cluster.name,
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

  const getToggleClusterAdminAccessDialogProps = () => (
    {
      ...baseProps,
      title: !cluster.cluster_admin_enabled ? 'Allow cluster-admin access' : 'Remove cluster-admin access',
      key: getKey('allowclusteradmin'),
      onClick: () => openModal('allow-cluster-admin', cluster),
    }
  );

  const adminConsoleItemProps = getAdminConosleProps();
  const scaleClusterItemProps = getScaleClusterProps();
  const editDisplayNameItemProps = getEditDisplayNameProps();
  const editConsoleURLItemProps = getEditConsoleURLProps();
  const deleteClusterItemProps = getDeleteItemProps();
  const archiveClusterItemProps = getArchiveClusterProps();
  const unarchiveClusterItemProps = getUnarchiveClusterProps();
  const editDisconnectedItemProps = getEditDisconnectedClusterProps();
  const editSubscriptionSettingsProps = getEditSubscriptionSettingsProps();
  const ToggleClusterAdminAccessDialogProps = getToggleClusterAdminAccessDialogProps();

  const showDelete = cluster.canDelete && cluster.managed;
  const showScale = cluster.canEdit && cluster.managed;
  const isArchived = get(cluster, 'subscription.status', false) === subscriptionStatuses.ARCHIVED;
  const showArchive = cluster.canEdit && !cluster.managed && cluster.subscription
    && !isArchived;
  const showUnarchive = cluster.canEdit && !cluster.managed && cluster.subscription
    && isArchived;
  const showEditURL = !cluster.managed && cluster.canEdit && (showConsoleButton || hasConsoleURL);
  const showEditDisconnected = cluster.canEdit && (get(cluster, 'subscription.status', false) === subscriptionStatuses.DISCONNECTED);
  const showEditSubscriptionSettings = !cluster.managed && cluster.canEdit && cluster.subscription;
  const showToggleClusterAdmin = cluster.managed && canAllowClusterAdmin;

  return [
    showConsoleButton && adminConsoleItemProps,
    cluster.canEdit && editDisplayNameItemProps,
    showEditURL && editConsoleURLItemProps,
    showScale && scaleClusterItemProps,
    showDelete && deleteClusterItemProps,
    showArchive && archiveClusterItemProps,
    showUnarchive && unarchiveClusterItemProps,
    showEditDisconnected && editDisconnectedItemProps,
    showEditSubscriptionSettings && editSubscriptionSettingsProps,
    showToggleClusterAdmin && ToggleClusterAdminAccessDialogProps,
  ].filter(Boolean);
}

function dropDownItems({
  cluster, showConsoleButton, openModal, canAllowClusterAdmin,
}) {
  const actions = actionResolver(
    cluster, showConsoleButton, openModal, canAllowClusterAdmin,
  );
  const menuItems = actions.map(
    action => (<DropdownItem {...action}>{action.title}</DropdownItem>),
  );
  return menuItems;
}

export { actionResolver, dropDownItems };
