import get from 'lodash/get';
import React from 'react';
import { DropdownItem } from '@patternfly/react-core';
import clusterStates from '../clusterStates';
import { subscriptionStatuses } from '../../../../common/subscriptionTypes';

// This is not a React component! It returns an array of DropDownItem instances.
// Do not render it directly.
function dropDownItems({
  cluster, showConsoleButton, showIDPButton, openModal, hasIDP, idpID,
}) {
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
      href: consoleURL,
      target: '_blank',
      rel: 'noopener noreferrer',
      key: getKey('adminconsole'),
    };

    const adminConsoleDisabled = {
      ...baseProps,
      isDisabled: true,
      tooltip: isClusterUninstalling ? uninstallingMessage : consoleDisabledMessage,
      key: getKey('adminconsole'),
    };

    return consoleURL && !isClusterUninstalling ? adminConsoleEnabled : adminConsoleDisabled;
  };

  const getEditClusterProps = () => {
    const editClusterBaseProps = {
      ...baseProps,
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
      key: getKey('editdisplayname'),
    };
    const editDisplayNameProps = {
      ...editDisplayNameBaseProps,
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
      key: getKey('unarchivecluster'),
    };
    const unarchiveModalData = {
      subscriptionID: cluster.subscription ? cluster.subscription.id : '',
      name: cluster.name ? cluster.name : '',
    };

    return { ...baseArchiveProps, onClick: () => openModal('unarchive-cluster', unarchiveModalData) };
  };

  const getEditConsoleURLProps = () => {
    const editConsoleURLBaseProps = {
      ...baseProps,
      key: getKey('editconsoleurl'),
    };
    const editConsoleURLProps = {
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
  const hasConsoleURL = get(cluster, 'console.url', false);
  const showEditURL = !cluster.managed && cluster.canEdit && (showConsoleButton || hasConsoleURL);

  return [
    showConsoleButton && (
    <DropdownItem {...adminConsoleItemProps}>Launch Console</DropdownItem>),
    cluster.canEdit && (
    <DropdownItem {...editDisplayNameItemProps}>Edit Display Name</DropdownItem>),
    showEditURL && (
    <DropdownItem {...editConsoleURLItemProps}>
      {
       hasConsoleURL ? 'Edit Console URL' : 'Add Console URL'}
    </DropdownItem>),
    showScale && <DropdownItem {...editClusterItemProps}>Scale Cluster</DropdownItem>,
    showDelete && <DropdownItem {...deleteClusterItemProps}>Delete Cluster</DropdownItem>,
    showArchive && <DropdownItem {...archiveClusterItemProps}>Archive Cluster</DropdownItem>,
    showUnarchive && <DropdownItem {...unarchiveClusterItemProps}>Unarchive Cluster</DropdownItem>,
    shouldShowIDPButton && (
    <DropdownItem {...deleteIDPItemProps}>Remove Identity Provider</DropdownItem>),
  ].filter(Boolean);
}

export default dropDownItems;
