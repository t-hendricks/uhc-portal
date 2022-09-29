import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ModalVariant } from '@patternfly/react-core';
import UpgradeAcknowledgeStep from '../UpgradeAcknowledgeStep';
import Modal from '../../../../../common/Modal/Modal';
import { getErrorState } from '../../../../../../common/errors';
import ErrorBox from '../../../../../common/ErrorBox';
import clusterService, { patchUpgradeSchedule } from '../../../../../../services/clusterService';

const UpgradeAcknowledgeModal = (props) => {
  const [pending, setPending] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState([]);
  const [unmetAcknowledgements, setUnmetAcknowledgements] = useState([]);
  const [fromVersion, setFromVersion] = useState('');
  const [toVersion, setToVersion] = useState('');

  const {
    modalData,
    closeModal,
    clusterId,
    setGate,
    isOpen,
    automaticUpgradePolicyId,
    setUpgradePolicy,
  } = props;

  useEffect(() => {
    if (isOpen) {
      setFromVersion(modalData.fromVersion);
      setToVersion(modalData.toVersion);
      setUnmetAcknowledgements(modalData.unmetAcknowledgements);
      setErrors([]);
    }
  }, [isOpen, modalData]);

  const onCancel = () => {
    closeModal();
  };

  const postClusterAcknowledge = async () => {
    setPending(true);
    setErrors([]);

    const foundErrors = [];
    if (automaticUpgradePolicyId) {
      try {
        const patchUpgradeScheduleResponse = await patchUpgradeSchedule(
          clusterId,
          automaticUpgradePolicyId,
          { enable_minor_version_upgrades: true },
        );
        setUpgradePolicy(patchUpgradeScheduleResponse.data);
      } catch (error) {
        foundErrors.push(error);
      }
    }

    if (foundErrors.length === 0) {
      const ids = unmetAcknowledgements.map((ack) => ack.id);

      const promises = ids.map((upgradeUpdateId) =>
        clusterService
          .postClusterGateAgreement(clusterId, upgradeUpdateId)
          .then(() => {
            setGate(upgradeUpdateId);
          })
          .catch((e) => Promise.reject(e)),
      );

      const response = await Promise.allSettled(promises);

      response.forEach((promise) => {
        if (promise.status === 'rejected') {
          foundErrors.push(promise.reason);
          if (confirmed) {
            setConfirmed(false);
          }
        }
      });
    }

    setPending(false);
    if (foundErrors.length === 0) {
      closeModal();
    } else {
      setErrors(foundErrors);
    }
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
      {errors.length === 0 ? (
        <UpgradeAcknowledgeStep
          fromVersion={fromVersion}
          toVersion={toVersion}
          unmetAcknowledgements={unmetAcknowledgements}
          confirmed={(isConfirmed) => setConfirmed(isConfirmed)}
        />
      ) : (
        errors.map((error) => (
          <ErrorBox
            message="Failed to save administrator acknowledgement."
            response={getErrorState({ payload: error })}
          />
        ))
      )}
    </Modal>
  );
};

UpgradeAcknowledgeModal.propTypes = {
  closeModal: PropTypes.func,
  clusterId: PropTypes.string,
  automaticUpgradePolicyId: PropTypes.string,
  isOpen: PropTypes.bool,
  modalData: PropTypes.shape,
  setGate: PropTypes.func,
  setUpgradePolicy: PropTypes.func,
};

UpgradeAcknowledgeModal.defaultProps = {};

export default UpgradeAcknowledgeModal;
