import React from 'react';

import { Flex, Form, TextInput } from '@patternfly/react-core';

import ErrorBox from '~/components/common/ErrorBox';
import Modal from '~/components/common/Modal/Modal';
import { clusterService } from '~/services';
import { ExternalAuth } from '~/types/clusters_mgmt.v1';

type DeleteExternalAuthProviderModalProps = {
  clusterId: string;
  externalAuthProvider: ExternalAuth | undefined;
  onClose: () => void;
};

export const DeleteExternalAuthProviderModal = (props: DeleteExternalAuthProviderModalProps) => {
  const { clusterId, externalAuthProvider, onClose } = props;
  const [providerNameInput, setProviderNameInput] = React.useState('');
  const [error, setError] = React.useState<unknown>();
  const [isPending, setIsPending] = React.useState(false);

  const closeDialog = () => {
    setProviderNameInput('');
    onClose();
  };

  const deleteExternalAuthProvider = async (clusterId: string, externalAuthProviderId: string) => {
    const request = clusterService.deleteExternalAuth;
    setIsPending(true);
    try {
      await request(clusterId, externalAuthProviderId).then((response) => response.data);
      closeDialog();
    } catch (error) {
      setError(error);
    } finally {
      setIsPending(false);
    }
  };
  const isValid = providerNameInput === externalAuthProvider?.id;
  const submitForm = (e: any) => {
    e.preventDefault();
    if (isValid) {
      deleteExternalAuthProvider(clusterId, providerNameInput);
    }
  };

  return (
    <Modal
      title={`Delete provider: ${externalAuthProvider?.id}`}
      onClose={closeDialog}
      primaryText="Delete"
      onPrimaryClick={() => {
        deleteExternalAuthProvider(clusterId, externalAuthProvider?.id || '');
      }}
      onSecondaryClick={closeDialog}
      isPrimaryDisabled={!isValid}
      primaryVariant="danger"
      isPending={isPending}
    >
      {error && (
        <ErrorBox
          message={`Failed to delete external auth provider: ${externalAuthProvider?.id}`}
          response={{
            errorMessage: (error as any)?.message,
            operationID: (error as any)?.response?.status?.toString(),
          }}
        />
      )}
      <Flex direction={{ default: 'column' }}>
        <p>
          This action cannot be undone. It will permanently remove the external authentication
          provider {externalAuthProvider?.id}.
        </p>
        <p>
          Confirm deletion by typing <strong>{externalAuthProvider?.id}</strong> below:
        </p>
        <Form onSubmit={submitForm}>
          <TextInput
            type="text"
            value={providerNameInput}
            placeholder="Enter name"
            onChange={(_event, newInput) => setProviderNameInput(newInput)}
            aria-label="provider name to delete"
          />
        </Form>
      </Flex>
    </Modal>
  );
};
