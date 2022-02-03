import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  ModalVariant,
} from '@patternfly/react-core';
import UpgradeAcknowledgeStep from '../UpgradeAcknowledgeStep';
import Modal from '../../../../../common/Modal/Modal';

import clusterService from '../../../../../../services/clusterService';

const UpgradeAcknowledgeModal = (props) => {
  const [pending, setPending] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [unmetAcknowledgements, setUnmetAcknowledgements] = useState([]);
  const [fromVersion, setFromVersion] = useState('');
  const [toVersion, setToVersion] = useState('');

  const {
    modalData, closeModal, clusterId, setGate, isOpen,
  } = props;

  useEffect(() => {
    if (isOpen) {
      setFromVersion(modalData.fromVersion);
      setToVersion(modalData.toVersion);
      setUnmetAcknowledgements(modalData.unmetAcknowledgements);
    }
  }, [isOpen, modalData]);

  const onCancel = () => {
    closeModal();
  };

  const postClusterAcknowledge = () => {
    setPending(true);
    const ids = unmetAcknowledgements.map(ack => ack.id);

    const promises = ids.map(upgradeUpdateId => (
      clusterService.postClusterGateAgreement(clusterId, upgradeUpdateId)
        .then(() => {
          setGate(upgradeUpdateId);
        })
    ));

    Promise.all(promises)
      .then(() => {
        setPending(false);
        closeModal();
      });
  };

  if (!isOpen) return null;

  return (
    <Modal
      title="Administrator acknowledgement"
      onClose={() => onCancel()}
      primaryText="Approve and continue"
      secondaryText="Cancel"
      onPrimaryClick={() => postClusterAcknowledge()}
      onSecondaryClick={() => onCancel()}
      isPrimaryDisabled={!confirmed}
      isPending={pending}
      className="ocm-upgrade-ack-modal"
      modalSize={ModalVariant.medium}
    >
      <UpgradeAcknowledgeStep
        fromVersion={fromVersion}
        toVersion={toVersion}
        unmetAcknowledgements={unmetAcknowledgements}
        confirmed={isConfirmed => setConfirmed(isConfirmed)}
      />
    </Modal>
  );
};

UpgradeAcknowledgeModal.propTypes = {
  closeModal: PropTypes.func,
  clusterId: PropTypes.string,
  isOpen: PropTypes.bool,
  modalData: PropTypes.shape,
  setGate: PropTypes.func,
};

UpgradeAcknowledgeModal.defaultProps = {
};

export default UpgradeAcknowledgeModal;
