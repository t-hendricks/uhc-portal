import get from 'lodash/get';
import React from 'react';
import { DropdownItem } from '@patternfly/react-core';
import clusterStates from '../clusterStates';
import { subscriptionStatuses } from '../../../../common/subscriptionTypes';

/**
 * This function is used by PF tables to determine which dropdown items are displayed
 * on each row of the table. It returns a list of objects, containing props for DropdownItem
 * PF table renders automatically.
 * @param {*} cluster             The cluster object corresponding to the current row
 * @param {*} showConsoleButton   true if 'Launch Console' button should be displayed
 * @param {*} showIDPButton       true 'Remove Identity Providers' button should be displayed
 * @param {*} openModal           Action to open modal
 * @param {*} hasIDP              true if exists an identity provider for current cluster
 * @param {*} idpID               Identity provider id if such exists
 */
function actionResolver(
  cluster, showConsoleButton, showIDPButton, openModal, hasIDP, idpID,
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

  const getAdminConosleProps = () => {
    const consoleURL = cluster.console ? cluster.console.url : false;
    const adminConsoleEnabled = {
      title: 'Launch Console',
      href: consoleURL,
      target: '_blank',
      rel: 'noopener noreferrer',
      key: getKey('adminconsole'),
    };
    const adminConsoleDisabled = {
      ...baseProps,
      title: 'Launch Console',
      isDisabled: true,
      tooltip: isClusterUninstalling ? uninstallingMessage : consoleDisabledMessage,
      key: getKey('adminconsole'),
    };
    return consoleURL && !isClusterUninstalling ? adminConsoleEnabled : adminConsoleDisabled;
  };
  const getEditClusterProps = () => {
    const editClusterBaseProps = {
      ...baseProps,
      title: 'Scale Cluster',
      key: getKey('editcluster'),
    };
    const managedEditProps = {
      ...editClusterBaseProps,
      onClick: () => openModal('edit-cluster', cluster),
    };
    const disabledManagedEditProps = {
      ...editClusterBaseProps,
      isDisabled: true,
      tooltip: isClusterUninstalling ? uninstallingMessage : notReadyMessage,
    };
    return isClusterReady ? managedEditProps : disabledManagedEditProps;
  };
  const getEditDisplayNameProps = () => {
    const editDisplayNameBaseProps = {
      ...baseProps,
      title: 'Edit Display Name',
      key: getKey('editdisplayname'),
    };
    const editDisplayNameProps = {
      ...editDisplayNameBaseProps,
      title: 'Edit Display Name',
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
      title: 'Archive Cluster',
      key: getKey('archivecluster'),
    };
    const archiveModalData = {
      subscriptionID: cluster.subscription ? cluster.subscription.id : '',
      name: cluster.name ? cluster.name : '',
    };
    return { ...baseArchiveProps, onClick: () => openModal('archive-cluster', archiveModalData) };
  };

  const getUnarchiveClusterProps = () => {
    const baseArchiveProps = {
      ...baseProps,
      title: 'Unarchive Cluster',
      key: getKey('unarchivecluster'),
    };
    const unarchiveModalData = {
      subscriptionID: cluster.subscription ? cluster.subscription.id : '',
      name: cluster.name ? cluster.name : '',
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
      title: hasConsoleURL ? 'Edit Console URL' : 'Add Console URL',
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
      title: 'Delete Cluster',
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

  const shouldShowIDPButton = showIDPButton && hasIDP && idpID;

  const getDeleteIDPProps = () => {
    const removeIDPModalData = {
      clusterID: cluster.id,
      idpID,
    };
    return {
      ...baseProps,
      key: getKey('deleteidp'),
      title: 'Remove Identity Provider',
      onClick: () => openModal('delete-idp', removeIDPModalData),
    };
  };

  const adminConsoleItemProps = getAdminConosleProps();
  const editClusterItemProps = getEditClusterProps();
  const editDisplayNameItemProps = getEditDisplayNameProps();
  const editConsoleURLItemProps = getEditConsoleURLProps();
  const deleteClusterItemProps = getDeleteItemProps();
  const archiveClusterItemProps = getArchiveClusterProps();
  const unarchiveClusterItemProps = getUnarchiveClusterProps();
  const deleteIDPItemProps = getDeleteIDPProps();

  const showDelete = cluster.canDelete && cluster.managed;
  const showScale = cluster.canEdit && cluster.managed;
  const isArchived = get(cluster, 'subscription.status', false) === subscriptionStatuses.ARCHIVED;
  const showArchive = cluster.canEdit && !cluster.managed && cluster.subscription
    && !isArchived;
  const showUnarchive = cluster.canEdit && !cluster.managed && cluster.subscription
    && isArchived;
  const showEditURL = !cluster.managed && cluster.canEdit && (showConsoleButton || hasConsoleURL);

  return [
    showConsoleButton && adminConsoleItemProps,
    cluster.canEdit && editDisplayNameItemProps,
    showEditURL && editConsoleURLItemProps,
    showScale && editClusterItemProps,
    showDelete && deleteClusterItemProps,
    showArchive && archiveClusterItemProps,
    showUnarchive && unarchiveClusterItemProps,
    shouldShowIDPButton && deleteIDPItemProps,
  ].filter(Boolean);
}

function dropDownItems({
  cluster, showConsoleButton, showIDPButton, openModal, hasIDP, idpID,
}) {
  const actions = actionResolver(
    cluster, showConsoleButton, showIDPButton, openModal, hasIDP, idpID,
  );
  const menuItems = actions.map(
    action => (<DropdownItem {...action}>{action.title}</DropdownItem>),
  );
  return menuItems;
}

export { actionResolver, dropDownItems };
