import React from 'react';
import { useDispatch } from 'react-redux';

import { Button, Icon, Title } from '@patternfly/react-core';
import { WizardContext as WizardContextDeprecated } from '@patternfly/react-core/deprecated';

import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { global_danger_color_100 as dangerColor } from '@patternfly/react-tokens/dist/esm/global_danger_color_100';

import Modal from '../../common/Modal/Modal';
import { closeModal } from '../../common/Modal/ModalActions';

type MissingPrereqErrorModalProps = {
  onRetry: (...args: any[]) => any;
  onClose: (...args: any[]) => any;
  title?: string;
};

const MissingPrereqErrorModal = ({
  onRetry,
  onClose,
  title = 'Missing prerequisite',
}: MissingPrereqErrorModalProps) => {
  const { goToStepById } = React.useContext(WizardContextDeprecated);
  const dispatch = useDispatch();

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
      header={
        <Title headingLevel="h2" size="2xl">
          <Icon className="pf-v5-u-mr-sm">
            <ExclamationCircleIcon color={dangerColor.value} />
          </Icon>
          {title}
        </Title>
      }
      modalSize="medium"
      aria-label={title}
      onPrimaryClick={close}
      onClose={close}
      actions={[
        <Button key="retry" variant="primary" onClick={onRetry} type="submit">
          Retry creating cluster
        </Button>,
        <Button key="prereq-guide" variant="secondary" onClick={goToClusterProviderStep}>
          Go back to prerequisites guide
        </Button>,
        <Button key="secondary" variant="secondary" onClick={close}>
          Cancel
        </Button>,
      ]}
    >
      <p>
        {/* eslint-disable-next-line max-len */}
        The cluster cannot be created because the provided AWS credentials don&apos;t belong to the{' '}
        <strong>osdCcsAdmin</strong> user. To provision a cluster successfully, your AWS account
        requires an IAM user called <strong>osdCcsAdmin</strong> with the{' '}
        <strong>AdministratorAccess</strong> policy.
      </p>

      <p className="pf-v5-u-mt-md">
        Make sure the IAM user exists in your AWS account and try creating the cluster again.
      </p>
    </Modal>
  );
};

export default MissingPrereqErrorModal;
