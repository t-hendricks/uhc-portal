// Modals shared between Cluster List and Cluster Details
import React from 'react';
import PropTypes from 'prop-types';

import ConnectedModal from '../../common/Modal/ConnectedModal';
import { ConnectedEditMachinePoolModal } from '../ClusterDetails/components/MachinePools/components/EditMachinePoolModal/EditMachinePoolModal';
import UpgradeWizardMR from '../commonMultiRegion/Upgrades/UpgradeWizard/UpgradeWizard';

import DeleteProtectionModal from './DeleteProtectionModal/DeleteProtectionModal';
import EditSubscriptionSettingsDialog from './EditSubscriptionSettingsDialog/EditSubscriptionSettingsDialog';
import UpgradeWizard from './Upgrades/UpgradeWizard';
import ArchiveClusterDialog from './ArchiveClusterDialog';
import DeleteClusterDialog from './DeleteClusterDialog';
import EditConsoleURLDialog from './EditConsoleURLDialog';
import EditDisplayNameDialog from './EditDisplayNameDialog';
import HibernateClusterModal from './HibernateClusterModal';
import ResumeClusterModal from './ResumeClusterModal';
import ScaleClusterDialog from './ScaleClusterDialog';
import TransferClusterOwnershipDialog from './TransferClusterOwnershipDialog';
import UnarchiveClusterDialog from './UnarchiveClusterDialog';
import UpgradeTrialClusterDialog from './UpgradeTrialClusterDialog';

function CommonClusterModals({
  onClose,
  onClusterDeleted,
  clearMachinePools,
  isMultiRegionPreviewEnabled,
}) {
  return (
    <>
      <ConnectedModal ModalComponent={EditDisplayNameDialog} onClose={onClose} />
      <ConnectedModal ModalComponent={EditConsoleURLDialog} onClose={onClose} />
      <ConnectedModal ModalComponent={TransferClusterOwnershipDialog} onClose={onClose} />
      <ConnectedModal ModalComponent={EditSubscriptionSettingsDialog} onClose={onClose} isDialog />
      <ConnectedModal ModalComponent={ScaleClusterDialog} onClose={onClose} />
      <ConnectedModal ModalComponent={ArchiveClusterDialog} onClose={onClose} />
      <ConnectedModal ModalComponent={HibernateClusterModal} onClose={onClose} />
      <ConnectedModal ModalComponent={ResumeClusterModal} onClose={onClose} />
      <ConnectedModal ModalComponent={UnarchiveClusterDialog} onClose={onClose} />
      <ConnectedModal ModalComponent={UpgradeTrialClusterDialog} onClose={onClose} />
      <ConnectedModal
        ModalComponent={isMultiRegionPreviewEnabled ? UpgradeWizardMR : UpgradeWizard}
      />
      <ConnectedModal ModalComponent={DeleteProtectionModal} onClose={onClose} />
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
      <ConnectedModal
        ModalComponent={ConnectedEditMachinePoolModal}
        clearMachinePools={clearMachinePools}
      />
    </>
  );
}

CommonClusterModals.propTypes = {
  onClose: PropTypes.func.isRequired,
  onClusterDeleted: PropTypes.func,
  clearMachinePools: PropTypes.bool,
  isMultiRegionPreviewEnabled: PropTypes.bool,
};

export default CommonClusterModals;
