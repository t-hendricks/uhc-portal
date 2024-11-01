// Modals shared between Cluster List and Cluster Details
import React from 'react';
import PropTypes from 'prop-types';

import ConnectedModal from '../../common/Modal/ConnectedModal';
import { ConnectedEditMachinePoolModal } from '../ClusterDetails/components/MachinePools/components/EditMachinePoolModal/EditMachinePoolModal';
import { ConnectedEditMachinePoolModal as ConnectedEditMachinePoolModalMR } from '../ClusterDetailsMultiRegion/components/MachinePools/components/EditMachinePoolModal/EditMachinePoolModal';
import ArchiveClusterDialogMR from '../commonMultiRegion/ArchiveClusterDialog';
import EditConsoleURLDialogMR from '../commonMultiRegion/EditConsoleURLDialog';
import EditDisplayNameDialogMR from '../commonMultiRegion/EditDisplayNameDialog';
import EditSubscriptionSettingsDialogMR from '../commonMultiRegion/EditSubscriptionSettingsDialog/EditSubscriptionSettingsDialog';
import ScaleClusterDialogMR from '../commonMultiRegion/ScaleClusterDialog';
import TransferClusterOwnershipDialogMR from '../commonMultiRegion/TransferClusterOwnershipDialog/TransferClusterOwnershipDialog';
import UpgradeWizardMR from '../commonMultiRegion/Upgrades/UpgradeWizard/UpgradeWizard';
import UpgradeTrialClusterDialogMR from '../commonMultiRegion/UpgradeTrialClusterDialog';

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
      <ConnectedModal
        ModalComponent={
          isMultiRegionPreviewEnabled ? EditDisplayNameDialogMR : EditDisplayNameDialog
        }
        onClose={onClose}
      />
      <ConnectedModal
        ModalComponent={isMultiRegionPreviewEnabled ? EditConsoleURLDialogMR : EditConsoleURLDialog}
        onClose={onClose}
      />
      <ConnectedModal
        ModalComponent={
          isMultiRegionPreviewEnabled
            ? EditSubscriptionSettingsDialogMR
            : EditSubscriptionSettingsDialog
        }
        onClose={onClose}
        isDialog
      />
      <ConnectedModal
        ModalComponent={isMultiRegionPreviewEnabled ? ScaleClusterDialogMR : ScaleClusterDialog}
        onClose={onClose}
      />

      <ConnectedModal
        ModalComponent={isMultiRegionPreviewEnabled ? ArchiveClusterDialogMR : ArchiveClusterDialog}
        onClose={onClose}
      />
      <ConnectedModal
        ModalComponent={
          isMultiRegionPreviewEnabled
            ? TransferClusterOwnershipDialogMR
            : TransferClusterOwnershipDialog
        }
        onClose={onClose}
      />
      <ConnectedModal ModalComponent={HibernateClusterModal} onClose={onClose} />
      <ConnectedModal ModalComponent={ResumeClusterModal} onClose={onClose} />
      <ConnectedModal ModalComponent={UnarchiveClusterDialog} onClose={onClose} />
      <ConnectedModal
        ModalComponent={
          isMultiRegionPreviewEnabled ? UpgradeTrialClusterDialogMR : UpgradeTrialClusterDialog
        }
        onClose={onClose}
      />
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
        ModalComponent={
          isMultiRegionPreviewEnabled
            ? ConnectedEditMachinePoolModalMR
            : ConnectedEditMachinePoolModal
        }
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
