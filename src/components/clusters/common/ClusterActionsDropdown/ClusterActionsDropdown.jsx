import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem } from 'patternfly-react';
import clusterStates from '../clusterStates';

const ClusterActionsDropdown = (props) => {
  const {
    cluster,
    showConsoleButton,
    openModal,
    openEditClusterDialog,
  } = props;

  const uninstallingMessage = 'The cluster is being uninstalled';
  const consoleDisabledMessage = 'Admin console is not yet available for this cluster';
  const selfManagedEditMessage = 'Self managed cluster cannot be edited';
  const notReadyMessage = 'This cluster is not ready';

  const isClusterUninstalling = cluster.state === clusterStates.UNINSTALLING;
  const isClusterReady = cluster.state === clusterStates.READY;

  const isUninstallingProps = isClusterUninstalling
    ? { disabled: true, title: uninstallingMessage } : {};

  const getAdminConosleProps = () => {
    const consoleURL = cluster.console ? cluster.console.url : false;

    const adminConsoleEnabled = {
      href: consoleURL,
      target: '_blank',
      rel: 'noreferrer',
    };

    const adminConsoleDisabled = {
      disabled: true,
      title: isClusterUninstalling ? uninstallingMessage : consoleDisabledMessage,
    };

    return consoleURL && !isClusterUninstalling ? adminConsoleEnabled : adminConsoleDisabled;
  };

  const getEditClusterProps = () => {
    const selfManagedEditProps = {
      disabled: true,
      title: isClusterUninstalling ? uninstallingMessage : selfManagedEditMessage,
    };

    const managedEditProps = { onClick: () => openEditClusterDialog(cluster) };

    const disabledManagedEditProps = {
      disabled: true,
      title: isClusterUninstalling ? uninstallingMessage : notReadyMessage,
    };

    if (!cluster.managed) {
      return selfManagedEditProps;
    }
    return isClusterReady ? managedEditProps : disabledManagedEditProps;
  };

  const getEditDisplayNameProps = () => {
    const editDisplayNameProps = {
      onClick: () => openModal('edit-display-name', cluster),
    };

    return isClusterUninstalling ? isUninstallingProps : editDisplayNameProps;
  };

  const getDeleteItemProps = () => {
    const deleteModalData = {
      clusterID: cluster.id,
      clusterName: cluster.name,
      managed: cluster.managed,
    };

    return isClusterUninstalling
      ? isUninstallingProps : { onClick: () => openModal('delete-cluster', deleteModalData) };
  };

  const adminConsoleItemProps = getAdminConosleProps();
  const editClusterItemProps = getEditClusterProps();
  const editDisplayNameItemProps = getEditDisplayNameProps();
  const deleteClusterItemProps = getDeleteItemProps();

  return (
    <React.Fragment>
      {showConsoleButton && <MenuItem {...adminConsoleItemProps}>Launch Admin Console</MenuItem>}
      <MenuItem {...editDisplayNameItemProps}>Edit Display Name</MenuItem>
      <MenuItem {...editClusterItemProps}>Edit Cluster</MenuItem>
      <MenuItem {...deleteClusterItemProps}>Delete Cluster</MenuItem>
    </React.Fragment>
  );
};

ClusterActionsDropdown.propTypes = {
  cluster: PropTypes.object.isRequired,
  showConsoleButton: PropTypes.bool.isRequired,
  openModal: PropTypes.func.isRequired,
  openEditClusterDialog: PropTypes.func.isRequired,
};

export default ClusterActionsDropdown;
