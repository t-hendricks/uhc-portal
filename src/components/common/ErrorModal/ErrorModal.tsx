import React from 'react';
import { Title } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
// eslint-disable-next-line camelcase
import { global_danger_color_100 } from '@patternfly/react-tokens';
import { formatErrorDetails } from '../../../common/errors';
import Modal from '../Modal/Modal';
import { ErrorState } from '~/types/types';

type Props = {
  title: string;
  errorResponse: ErrorState;
  resetResponse: () => void;
  closeModal: () => void;
};

const ErrorModal = ({ title, errorResponse, resetResponse, closeModal }: Props) => {
  const close = React.useCallback(() => {
    resetResponse();
    closeModal();
  }, [resetResponse, closeModal]);

  const errorDetails = formatErrorDetails(errorResponse.errorDetails);

  return (
    <Modal
      header={
        <Title headingLevel="h2" size="2xl">
          <ExclamationCircleIcon color={global_danger_color_100.value} /> {title}
        </Title>
      }
      primaryText="Close"
      onPrimaryClick={close}
      onClose={close}
      showClose={false}
      showSecondary={false}
      aria-label={title}
    >
      <p>{errorResponse.errorMessage}</p>
      {errorDetails && <p>{errorDetails}</p>}
      <p>{`Operation ID: ${errorResponse.operationID || 'N/A'}`}</p>
    </Modal>
  );
};

export default ErrorModal;
