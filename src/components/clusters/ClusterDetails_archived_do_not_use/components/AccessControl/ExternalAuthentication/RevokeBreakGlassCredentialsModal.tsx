import React from 'react';
import { AxiosError } from 'axios';

import { Button, Flex, Modal } from '@patternfly/react-core';

import ErrorBox from '~/components/common/ErrorBox';
import { clusterService } from '~/services';

type RevokeBreakGlassCredentialsModalProps = {
  clusterId: string;
  onClose: () => void;
  isOpen?: boolean;
};

export const RevokeBreakGlassCredentialsModal = (props: RevokeBreakGlassCredentialsModalProps) => {
  const { clusterId, onClose, isOpen = true } = props;
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
      isOpen={isOpen}
      variant="medium"
      actions={[
        <Button
          key="revoke"
          variant="primary"
          isDisabled={isPending}
          isLoading={isPending}
          onClick={() => deleteBreakGlassCredential(clusterId)}
        >
          Revoke all
        </Button>,
        <Button key="cancel" variant="secondary" onClick={handleClose}>
          Cancel
        </Button>,
      ]}
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
