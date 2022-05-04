import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { Title, Button } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { global_danger_color_100 as ExclamationCircleColor } from '@patternfly/react-tokens';

import links from '../../../common/installLinks.mjs';
import Modal from '../../common/Modal/Modal';
import { closeModal } from '../../common/Modal/ModalActions';
import ExternalLink from '../../common/ExternalLink';

const MissingPrereqErrorModal = ({ onRetry, onClose }) => {
  const dispatch = useDispatch();
  const title = 'Missing prerequisite';

  const close = () => {
    dispatch(closeModal());
    onClose();
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
          Retry
        </Button>,
        <Button key="secondary" variant="secondary" onClick={close}>
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
        When the AIM user exists in your AWS account, retry to create your cluster.
        {' '}
        For more guidance, see the
        {' '}
        <ExternalLink href={links.OSD_CCS_AWS_CUSTOMER_REQ}>
          customer cloud subscription requirements
        </ExternalLink>
        {' '}
      </p>
    </Modal>
  );
};

MissingPrereqErrorModal.propTypes = {
  onRetry: PropTypes.func,
  onClose: PropTypes.func,
};

export default MissingPrereqErrorModal;
