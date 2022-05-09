import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { Title, Button, WizardContext } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { global_danger_color_100 as ExclamationCircleColor } from '@patternfly/react-tokens';

import Modal from '../../common/Modal/Modal';
import { closeModal } from '../../common/Modal/ModalActions';

const MissingPrereqErrorModal = ({ onRetry, onClose }) => {
  const { goToStepById } = React.useContext(WizardContext);
  const dispatch = useDispatch();
  const title = 'Missing prerequisite';

  const close = () => {
    dispatch(closeModal());
    onClose();
  };

  const goToClusterProviderStep = () => {
    goToStepById(21);
    close();
  };

  return (
    <Modal
      header={(
        <Title headingLevel="h2" size="2xl">
          <ExclamationCircleIcon color={ExclamationCircleColor.value} className="pf-u-mr-sm" />
          {title}
        </Title>
      )}
      modalSize="medium"
      aria-label={title}
      onPrimaryClick={close}
      onClose={close}
      actions={[
        <Button
          key="retry"
          variant="primary"
          onClick={onRetry}
          type="submit"
        >
          Retry creating cluster
        </Button>,
        <Button
          key="prereq-guide"
          variant="secondary"
          onClick={goToClusterProviderStep}
        >
          Go back to prerequisites guide
        </Button>,
        <Button
          key="secondary"
          variant="secondary"
          onClick={close}
        >
          Cancel
        </Button>,
      ]}
    >
      <p>
        {/* eslint-disable-next-line max-len */}
        The cluster cannot be created because the provided AWS credentials don&apos;t belong to the
        {' '}
        <strong>osdCcsAdmin</strong>
        {' '}
        user. To provision a cluster successfully, your AWS account requires an IAM user called
        {' '}
        <strong>osdCcsAdmin</strong>
        {' '}
        with the
        {' '}
        <strong>AdministratorAccess</strong>
        {' '}
        policy.
      </p>

      <p className="pf-u-mt-md">
        Make sure the IAM user exists in your AWS account and try creating the cluster again.
      </p>
    </Modal>
  );
};

MissingPrereqErrorModal.propTypes = {
  onRetry: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MissingPrereqErrorModal;
