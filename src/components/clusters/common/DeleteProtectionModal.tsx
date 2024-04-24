import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Flex } from '@patternfly/react-core';

import { useGlobalState } from '~/redux/hooks';

import ErrorBox from '../../common/ErrorBox';
import Modal from '../../common/Modal/Modal';
import { closeModal } from '../../common/Modal/ModalActions';
import modals from '../../common/Modal/modals';
import {
  clearUpdateDeleteProtection,
  updateDeleteProtection as updateDeleteProtectionAction,
} from '../ClusterDetails/components/Overview/DetailsRight/DeleteProtection/deleteProtectionActions';

const DeleteProtectionModal = ({ onClose }: { onClose: () => void }) => {
  const modalData = useGlobalState((state) => state.modal.data) as any;
  const dispatch = useDispatch();
  const { updateDeleteProtection } = useGlobalState((state) => state.deleteProtection);

  const { protectionEnabled } = modalData;

  const handleClose = () => {
    dispatch(closeModal());
  };

  const handlePrimaryClick = () => {
    dispatch(updateDeleteProtectionAction(modalData.clusterID, !protectionEnabled));
  };

  useEffect(() => {
    if (updateDeleteProtection.fulfilled) {
      onClose();
      dispatch(closeModal());
      dispatch(clearUpdateDeleteProtection());
    }
  }, [updateDeleteProtection, onClose, dispatch]);

  return (
    <Modal
      title={`${protectionEnabled ? 'Disable' : 'Enable'} deletion protection`}
      onClose={handleClose}
      primaryText={protectionEnabled ? 'Disable' : 'Enable'}
      primaryVariant={protectionEnabled ? 'danger' : 'primary'}
      onPrimaryClick={handlePrimaryClick}
      onSecondaryClick={handleClose}
      data-testid="delete-protection-dialog"
      titleIconVariant="warning"
      isPending={updateDeleteProtection.pending}
    >
      <Flex direction={{ default: 'column' }}>
        {updateDeleteProtection.error ? (
          <ErrorBox
            message={`Error ${protectionEnabled ? 'disabling' : 'enabling'} Delete Protection`}
            response={updateDeleteProtection}
          />
        ) : null}
        <p>
          {protectionEnabled
            ? 'Disabling the Deletion Protection will allow you to delete this cluster. Cluster deletion can result in data loss or service disruption.'
            : 'The cluster cannot be deleted if the Deletion Protection is enabled to safeguard from accidental deletion. You can disable the Deletion Protection at any time.'}
        </p>
        <br />
        <p>
          <b>{`${protectionEnabled ? 'Disable' : 'Enable'} Deletion Protection for this cluster?`}</b>
        </p>
      </Flex>
    </Modal>
  );
};

DeleteProtectionModal.modalName = modals.DELETE_PROTECTION;

export default DeleteProtectionModal;
