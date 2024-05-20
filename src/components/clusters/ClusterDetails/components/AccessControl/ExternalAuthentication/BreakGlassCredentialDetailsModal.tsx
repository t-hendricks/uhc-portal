import React from 'react';
import { AxiosError } from 'axios';

import {
  Button,
  ClipboardCopy,
  ClipboardCopyVariant,
  Stack,
  StackItem,
} from '@patternfly/react-core';

import ErrorBox from '~/components/common/ErrorBox';
import Modal from '~/components/common/Modal/Modal';
import { clusterService } from '~/services';
import { BreakGlassCredential } from '~/types/clusters_mgmt.v1';

type BreakGlassCredentialDetailsModalProps = {
  clusterID: string;
  onClose: () => void;
  credential?: BreakGlassCredential;
};

export function BreakGlassCredentialDetailsModal(props: BreakGlassCredentialDetailsModalProps) {
  const { clusterID, onClose, credential } = props;
  const [credentialData, setCredentialData] = React.useState<BreakGlassCredential>();
  const [error, setError] = React.useState<AxiosError>();
  const [isPending, setIsPending] = React.useState(false);

  React.useEffect(() => {
    setError(undefined);
    setIsPending(true);
    (async () => {
      const request = clusterService.getBreakGlassCredentialDetails;
      try {
        const creds: BreakGlassCredential | any = await request(
          clusterID || '',
          credential?.id || '',
        ).then((response) => response.data);
        setCredentialData(creds);
      } catch (error) {
        setError(error as AxiosError);
      } finally {
        setIsPending(false);
      }
    })();
  }, [clusterID, credential?.id]);

  const statusMessage = () => {
    if (credentialData?.status === 'revoked') {
      return 'Credentials have been revoked.';
    }
    if (credentialData?.status === 'created') {
      return 'Credentials are being created. Try again later.';
    }
    return 'Here are the credentials';
  };

  const handleClose = () => {
    setError(undefined);
    onClose();
  };

  return (
    <Modal
      id="edit-mp-modal"
      title={`${credential?.username} credentials`}
      onClose={handleClose}
      modalSize="large"
      description="Use these temporary credentials to access your cluster."
      footer={
        <Stack hasGutter>
          <StackItem>
            <Button
              variant="secondary"
              isDisabled={false}
              onClick={handleClose}
              data-testid="cancel-btn"
            >
              Close
            </Button>
          </StackItem>
        </Stack>
      }
    >
      {statusMessage()}
      {error && (
        <StackItem>
          <ErrorBox
            message="A problem occurred while retrieving credential"
            response={{
              errorMessage: (error.response?.data as any)?.reason,
              operationID: (error.response?.data as any)?.operation_id,
            }}
          />
        </StackItem>
      )}

      <ClipboardCopy isReadOnly variant={ClipboardCopyVariant.expansion}>
        {isPending ? 'Loading...' : credentialData?.kubeconfig || 'No kubeconfig'}
      </ClipboardCopy>
    </Modal>
  );
}
