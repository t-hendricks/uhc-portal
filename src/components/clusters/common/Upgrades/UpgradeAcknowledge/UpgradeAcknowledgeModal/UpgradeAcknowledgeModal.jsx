import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { ModalVariant } from '@patternfly/react-core';

import { modalActions } from '~/components/common/Modal/ModalActions';
import shouldShowModal from '~/components/common/Modal/ModalSelectors';
import { useEditSchedule } from '~/queries/ClusterDetailsQueries/ClusterSettingsTab/useEditSchedule';
import { usePostClusterGateAgreementAcknowledgeModal } from '~/queries/ClusterDetailsQueries/ClusterSettingsTab/usePostClusterGateAgreement';
import { useGlobalState } from '~/redux/hooks';

import ErrorBox from '../../../../../common/ErrorBox';
import Modal from '../../../../../common/Modal/Modal';
import { setAutomaticUpgradePolicy } from '../../clusterUpgradeActions';
import UpgradeAcknowledgeStep from '../UpgradeAcknowledgeStep';

const UpgradeAcknowledgeModal = (props) => {
  const { clusterId, isHypershift, isSTSEnabled, schedules, region } = props;
  const { mutateAsync: editScheduleMutate } = useEditSchedule(clusterId, isHypershift, region);
  const { mutateAsync: postClusterGateAgreementMutate } =
    usePostClusterGateAgreementAcknowledgeModal(clusterId, region);
  const dispatch = useDispatch();
  const [pending, setPending] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState([]);
  const [unmetAcknowledgements, setUnmetAcknowledgements] = useState([]);
  const [fromVersion, setFromVersion] = useState('');
  const [toVersion, setToVersion] = useState('');

  const isOpen = useGlobalState((state) => shouldShowModal(state, 'ack-upgrade'));
  const modalData = useGlobalState((state) => state.modal.data);
  const automaticUpgradePolicyId = schedules?.items?.find(
    (policy) => policy.schedule_type === 'automatic',
  ).id;

  useEffect(() => {
    if (isOpen) {
      setFromVersion(modalData.fromVersion);
      setToVersion(modalData.toVersion);
      setUnmetAcknowledgements(modalData.unmetAcknowledgements);
      setErrors([]);
    }
  }, [isOpen, modalData]);

  const onCancel = () => {
    dispatch(modalActions.closeModal());
  };

  const postClusterAcknowledge = async () => {
    setPending(true);
    setErrors([]);

    const foundErrors = [];
    if (automaticUpgradePolicyId && !isSTSEnabled) {
      try {
        const response = await editScheduleMutate({
          policyID: automaticUpgradePolicyId,
          schedule: { enable_minor_version_upgrades: true },
        });

        dispatch(setAutomaticUpgradePolicy(response.data));
      } catch (error) {
        foundErrors.push(error);
      }
    }

    if (foundErrors.length === 0) {
      const ids = unmetAcknowledgements.map((ack) => ack.id);

      const response = await postClusterGateAgreementMutate(ids);

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
      dispatch(modalActions.closeModal());
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
        errors.map((error, index) => (
          <ErrorBox
            /* eslint-disable-next-line react/no-array-index-key */
            key={`err-${index}`}
            message="Failed to save administrator acknowledgement."
            response={error}
          />
        ))
      )}
    </Modal>
  );
};

UpgradeAcknowledgeModal.propTypes = {
  clusterId: PropTypes.string,
  isHypershift: PropTypes.bool,
  isSTSEnabled: PropTypes.bool,
  schedules: PropTypes.object,
  region: PropTypes.string,
};

UpgradeAcknowledgeModal.defaultProps = {};

export default UpgradeAcknowledgeModal;
