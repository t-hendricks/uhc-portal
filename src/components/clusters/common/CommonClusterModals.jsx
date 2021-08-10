// Modals shared between Cluster List and Cluster Details
import React from 'react';
import PropTypes from 'prop-types';

import ScaleClusterDialog from './ScaleClusterDialog';
import EditNodeCountModal from './EditNodeCountModal';
import ArchiveClusterDialog from './ArchiveClusterDialog';
import HibernateClusterModal from './HibernateClusterModal';
import ResumeClusterModal from './ResumeClusterModal';
import UnarchiveClusterDialog from './UnarchiveClusterDialog';
import EditDisplayNameDialog from './EditDisplayNameDialog';
import EditConsoleURLDialog from './EditConsoleURLDialog';
import EditSubscriptionSettingsDialog from './EditSubscriptionSettingsDialog';
import TransferClusterOwnershipDialog from './TransferClusterOwnershipDialog';
import UpgradeTrialClusterDialog from './UpgradeTrialClusterDialog';
import DeleteClusterDialog from './DeleteClusterDialog';
import UpgradeWizard from './Upgrades/UpgradeWizard';
import ConnectedModal from '../../common/Modal/ConnectedModal';

function CommonClusterModals({ onClose, onClusterDeleted }) {
  return (
    <>
      <ConnectedModal ModalComponent={EditDisplayNameDialog} onClose={onClose} />
      <ConnectedModal ModalComponent={EditConsoleURLDialog} onClose={onClose} />
      <ConnectedModal
        ModalComponent={TransferClusterOwnershipDialog}
        onClose={onClose}
      />
      <ConnectedModal ModalComponent={EditSubscriptionSettingsDialog} onClose={onClose} isDialog />
      <ConnectedModal ModalComponent={ScaleClusterDialog} onClose={onClose} />
      <ConnectedModal ModalComponent={EditNodeCountModal} onClose={onClose} />
      <ConnectedModal ModalComponent={ArchiveClusterDialog} onClose={onClose} />
      <ConnectedModal ModalComponent={HibernateClusterModal} onClose={onClose} />
      <ConnectedModal ModalComponent={ResumeClusterModal} onClose={onClose} />
      <ConnectedModal
        ModalComponent={UnarchiveClusterDialog}
        onClose={onClose}
      />
      <ConnectedModal
        ModalComponent={UpgradeTrialClusterDialog}
        onClose={onClose}
      />
      <ConnectedModal ModalComponent={UpgradeWizard} />
      <ConnectedModal
        ModalComponent={DeleteClusterDialog}
        onClose={(clusterDeleted) => {
          if (clusterDeleted) {
            if (onClusterDeleted) {
              onClusterDeleted();
            } else {
              onClose();
            }
          }
        }}
      />
    </>
  );
}

CommonClusterModals.propTypes = {
  onClose: PropTypes.func.isRequired,
  onClusterDeleted: PropTypes.func,
};

export default CommonClusterModals;
