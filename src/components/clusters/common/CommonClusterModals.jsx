// Modals shared between Cluster List and Cluster Details
import React from 'react';
import PropTypes from 'prop-types';

import ConnectedModal from '../../common/Modal/ConnectedModal';
import { ConnectedEditMachinePoolModal as ConnectedEditMachinePoolModalMR } from '../ClusterDetailsMultiRegion/components/MachinePools/components/EditMachinePoolModal/EditMachinePoolModal';
import ArchiveClusterDialogMR from '../commonMultiRegion/ArchiveClusterDialog';
import DeleteClusterDialogMR from '../commonMultiRegion/DeleteClusterDialog';
import DeleteProtectionModalMR from '../commonMultiRegion/DeleteProtectionModal/DeleteProtectionModal';
import EditConsoleURLDialogMR from '../commonMultiRegion/EditConsoleURLDialog';
import EditDisplayNameDialogMR from '../commonMultiRegion/EditDisplayNameDialog';
import EditSubscriptionSettingsDialogMR from '../commonMultiRegion/EditSubscriptionSettingsDialog/EditSubscriptionSettingsDialog';
import HibernateClusterModalMR from '../commonMultiRegion/HibernateClusterModal';
import ScaleClusterDialogMR from '../commonMultiRegion/ScaleClusterDialog';
import TransferClusterOwnershipDialogMR from '../commonMultiRegion/TransferClusterOwnershipDialog/TransferClusterOwnershipDialog';
import UnarchiveClusterDialogMR from '../commonMultiRegion/UnarchiveClusterDialog';
import UpgradeWizardMR from '../commonMultiRegion/Upgrades/UpgradeWizard/UpgradeWizard';
import UpgradeTrialClusterDialogMR from '../commonMultiRegion/UpgradeTrialClusterDialog';

import ResumeClusterModal from './ResumeClusterModal';

function CommonClusterModals({ onClose, onClusterDeleted, clearMachinePools }) {
  return (
    <>
      <ConnectedModal ModalComponent={EditDisplayNameDialogMR} onClose={onClose} />
      <ConnectedModal ModalComponent={EditConsoleURLDialogMR} onClose={onClose} />
      <ConnectedModal
        ModalComponent={EditSubscriptionSettingsDialogMR}
        onClose={onClose}
        isDialog
      />
      <ConnectedModal ModalComponent={ScaleClusterDialogMR} onClose={onClose} />

      <ConnectedModal ModalComponent={ArchiveClusterDialogMR} onClose={onClose} />
      <ConnectedModal ModalComponent={TransferClusterOwnershipDialogMR} onClose={onClose} />
      <ConnectedModal ModalComponent={HibernateClusterModalMR} onClose={onClose} />
      <ConnectedModal ModalComponent={ResumeClusterModal} onClose={onClose} />
      <ConnectedModal ModalComponent={UpgradeTrialClusterDialogMR} onClose={onClose} />
      <ConnectedModal ModalComponent={UnarchiveClusterDialogMR} onClose={onClose} />
      <ConnectedModal ModalComponent={UpgradeWizardMR} />

      <ConnectedModal ModalComponent={DeleteProtectionModalMR} onClose={onClose} />

      <ConnectedModal
        ModalComponent={DeleteClusterDialogMR}
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
        ModalComponent={ConnectedEditMachinePoolModalMR}
        clearMachinePools={clearMachinePools}
      />
    </>
  );
}

CommonClusterModals.propTypes = {
  onClose: PropTypes.func.isRequired,
  onClusterDeleted: PropTypes.func,
  clearMachinePools: PropTypes.bool,
};

export default CommonClusterModals;
