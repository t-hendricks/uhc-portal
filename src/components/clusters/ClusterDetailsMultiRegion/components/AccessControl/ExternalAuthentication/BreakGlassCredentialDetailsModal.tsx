import React from 'react';
import { AxiosError } from 'axios';

import {
  Button,
  ClipboardCopy,
  ClipboardCopyVariant,
  Modal,
  StackItem,
} from '@patternfly/react-core';

import ErrorBox from '~/components/common/ErrorBox';
import { clusterService } from '~/services';
import { BreakGlassCredential } from '~/types/clusters_mgmt.v1';

const DownloadButton = ({ textOutput, disabled }: { textOutput: string; disabled: boolean }) => {
  const file = new Blob([textOutput], { type: 'text/plain' });

  return (
    <Button
      component="a"
      variant="primary"
      download="kubeConfig.txt"
      target="_blank"
      rel="noreferrer"
      href={URL.createObjectURL(file)}
      isDisabled={disabled}
    >
      Download
    </Button>
  );
};

type BreakGlassCredentialDetailsModalProps = {
  clusterID: string;
  onClose: () => void;
  credential?: BreakGlassCredential;
  isOpen?: boolean;
};

export function BreakGlassCredentialDetailsModal(props: BreakGlassCredentialDetailsModalProps) {
  const { clusterID, onClose, credential, isOpen = true } = props;
  const [credentialData, setCredentialData] = React.useState<BreakGlassCredential>();
  const [error, setError] = React.useState<AxiosError>();
  const [isPending, setIsPending] = React.useState(false);

  React.useEffect(() => {
    setError(undefined);
    setIsPending(true);
    (async () => {
      const request = clusterService.getBreakGlassCredentialDetails;
      try {
        const creds: BreakGlassCredential = await request(
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
      variant="medium"
      description="Use these temporary credentials to access your cluster."
      isOpen={isOpen}
      actions={[
        <DownloadButton
          textOutput={credentialData?.kubeconfig || ''}
          disabled={isPending || !credentialData?.kubeconfig}
        />,
        <Button key="cancel" variant="secondary" onClick={handleClose}>
          Cancel
        </Button>,
      ]}
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
