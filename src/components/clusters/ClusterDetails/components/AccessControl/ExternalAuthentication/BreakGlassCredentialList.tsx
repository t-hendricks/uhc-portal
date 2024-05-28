import React from 'react';
import { AxiosError } from 'axios';

import { Button, Flex, FlexItem, Icon, Tooltip } from '@patternfly/react-core';
import RedoIcon from '@patternfly/react-icons/dist/esm/icons/redo-icon';
import { Caption, Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import ErrorBox from '~/components/common/ErrorBox';
import { useGlobalState } from '~/redux/hooks';
import { clusterService } from '~/services';
import type { BreakGlassCredential } from '~/types/clusters_mgmt.v1';
import { BreakGlassCredentialStatus } from '~/types/clusters_mgmt.v1';

import ButtonWithTooltip from '../../../../../common/ButtonWithTooltip';

import { BreakGlassCredentialDetailsModal } from './BreakGlassCredentialDetailsModal';
import { BreakGlassCredentialNewModal } from './BreakGlassCredentialNewModal';
import { RevokeBreakGlassCredentialsModal } from './RevokeBreakGlassCredentialsModal';

const credentialStatus = (status: BreakGlassCredentialStatus | undefined) => {
  let message: string;
  let helpText: string;
  switch (status) {
    case BreakGlassCredentialStatus.ISSUED:
      message = 'Credentials issued';
      helpText = 'Credentials issued';
      break;
    case BreakGlassCredentialStatus.REVOKED:
    case BreakGlassCredentialStatus.AWAITING_REVOCATION:
      message = 'Revoked';
      helpText = 'Credentials have been manually revoked and are no longer valid.';
      break;
    case BreakGlassCredentialStatus.EXPIRED:
      message = 'Expired';
      helpText = 'Credentials have passed their expiration date and are no longer valid.';
      break;
    case BreakGlassCredentialStatus.CREATED:
      message = 'Pending';
      helpText = 'Credentials have been created but not yet issued kubeconfig.';
      break;
    case BreakGlassCredentialStatus.FAILED:
      message = 'Failed';
      helpText = 'Unable to create credentials.';
      break;
    default:
      message = 'Unknown status';
      helpText = 'Unknown status';
      break;
  }

  return (
    <Tooltip content={helpText}>
      <Button variant="plain">{message}</Button>
    </Tooltip>
  );
};
export function BreakGlassCredentialList() {
  const [credentialData, setCredentialData] = React.useState<BreakGlassCredential[]>([]);
  const [credential, setCredential] = React.useState<BreakGlassCredential | undefined>(undefined);
  const [error, setError] = React.useState<AxiosError<any>>();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);
  const clusterID = useGlobalState((state) => state.clusters.details.cluster.id);
  const canEdit = useGlobalState((state) => state.clusters.details.cluster.canEdit);

  React.useEffect(() => {
    setError(undefined);
    setIsPending(true);
    if (canEdit) {
      (async () => {
        const request = clusterService.getBreakGlassCredentials;
        try {
          const creds = await request(clusterID || '').then((response) => response.data);
          setCredentialData(creds?.items || []);
        } catch (error) {
          setError(error as AxiosError);
        } finally {
          setIsPending(false);
        }
      })();
    }
  }, [clusterID, credential?.id, isModalOpen, isDeleteModalOpen, isNewModalOpen, canEdit, refresh]);

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };
  const getCredentials = (user: BreakGlassCredential | undefined) => {
    setIsModalOpen(true);
    setCredential(user);
  };
  const columns = {
    id: 'ID',
    username: 'Username',
    expiration_timestamp: 'Expires',
    status: 'Status',
  };

  const disableNewCredReason =
    !canEdit && 'You do not have permission to create new credentials for this cluster.';

  const isValidCred = () =>
    credentialData.some((cred) => cred.status === BreakGlassCredentialStatus.ISSUED);

  return (
    <>
      {isModalOpen && (
        <BreakGlassCredentialDetailsModal
          clusterID={clusterID || ''}
          onClose={() => {
            setIsModalOpen(false);
          }}
          credential={credential}
        />
      )}
      <BreakGlassCredentialNewModal
        clusterId={clusterID || ''}
        isNewModalOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        credentialList={credentialData?.map((cred) => cred.username || '') || []}
      />
      <Flex>
        <FlexItem>
          <ButtonWithTooltip
            className="access-control-add"
            variant="secondary"
            onClick={() => setIsNewModalOpen(true)}
            disableReason={disableNewCredReason}
          >
            New credentials
          </ButtonWithTooltip>
        </FlexItem>
        {credentialData.length && canEdit ? (
          <>
            <FlexItem align={{ default: 'alignRight' }}>
              <ButtonWithTooltip
                className="access-control-add"
                variant="danger"
                onClick={handleDelete}
                isDisabled={isPending || !isValidCred()}
              >
                Revoke all credentials
              </ButtonWithTooltip>
            </FlexItem>
            <FlexItem>
              <ButtonWithTooltip
                className="access-control-add"
                variant="plain"
                onClick={() => setRefresh(!refresh)}
                isDisabled={isPending}
              >
                <Icon>
                  <RedoIcon />
                </Icon>
              </ButtonWithTooltip>
            </FlexItem>
          </>
        ) : null}
      </Flex>
      {credentialData.length ? (
        <Table aria-label="break glass credential table" variant="compact">
          <Caption>Assigned credentials</Caption>
          <Thead>
            <Tr>
              <Th>{columns.id}</Th>
              <Th>{columns.username}</Th>
              <Th>{columns.expiration_timestamp}</Th>
              <Th>{columns.status}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {credentialData?.map((cred) => (
              <Tr key={cred.id}>
                <Td>{cred.id}</Td>
                <Td>{cred.username}</Td>
                <Td>{new Date(cred.expiration_timestamp as string).toLocaleString('en-CA')}</Td>
                <Td>
                  {cred.status === BreakGlassCredentialStatus.ISSUED ? (
                    <Tooltip content="Download credentials to access cluster as admin.">
                      <Button variant="link" onClick={() => getCredentials(cred)}>
                        Credentials issued
                      </Button>
                    </Tooltip>
                  ) : (
                    credentialStatus(cred.status || undefined)
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : null}
      {error && (
        <ErrorBox
          message="A problem occurred while retrieving credentials"
          response={{
            errorMessage: error.message,
            operationID: error.response?.data.operation_id,
          }}
        />
      )}
      {isDeleteModalOpen && (
        <RevokeBreakGlassCredentialsModal
          clusterId={clusterID || ''}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setCredential(undefined);
          }}
        />
      )}
    </>
  );
}
