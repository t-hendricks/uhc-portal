import React from 'react';
import { AxiosError } from 'axios';

import { Flex } from '@patternfly/react-core';

import ErrorBox from '~/components/common/ErrorBox';
import Modal from '~/components/common/Modal/Modal';
import { clusterService } from '~/services';

type RevokeBreakGlassCredentialsModalProps = {
  clusterId: string;
  onClose: () => void;
};

export const RevokeBreakGlassCredentialsModal = (props: RevokeBreakGlassCredentialsModalProps) => {
  const { clusterId, onClose } = props;
  const [error, setError] = React.useState<AxiosError>();
  const [isPending, setIsPending] = React.useState(false);

  const handleClose = () => {
    setError(undefined);
    onClose();
  };

  const deleteBreakGlassCredential = async (clusterId: string) => {
    const request = clusterService.revokeBreakGlassCredentials;
    setError(undefined);
    setIsPending(true);
    try {
      await request(clusterId).then((response) => response.data);
      handleClose();
    } catch (error) {
      setError(error as AxiosError);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Modal
      title="Revoke all credentials for cluster"
      onClose={handleClose}
      primaryText="Revoke All"
      isPrimaryDisabled={isPending}
      isSecondaryDisabled={isPending}
      onPrimaryClick={() => deleteBreakGlassCredential(clusterId)}
      onSecondaryClick={handleClose}
      primaryVariant="danger"
      isPending={isPending}
    >
      {error ? (
        <ErrorBox
          message="A problem occurred while deleting the credentials."
          response={{
            errorMessage: (error.response?.data as any)?.reason,
            operationID: (error.response?.data as any)?.operation_id,
          }}
        />
      ) : (
        <Flex direction={{ default: 'column' }}>
          <p>This action cannot be undone. It will permanently revoke all credentials.</p>
        </Flex>
      )}
    </Modal>
  );
};
