import React from 'react';
import { AxiosError } from 'axios';

import {
  ActionsColumn,
  Caption,
  IAction,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';

import ErrorBox from '~/components/common/ErrorBox';
import { useGlobalState } from '~/redux/hooks';
import { clusterService } from '~/services';
import type { BreakGlassCredential } from '~/types/clusters_mgmt.v1';

import ButtonWithTooltip from '../../../../../common/ButtonWithTooltip';

import { BreakGlassCredentialDetailsModal } from './BreakGlassCredentialDetailsModal';
import { BreakGlassCredentialNewModal } from './BreakGlassCredentialNewModal';
import { RevokeBreakGlassCredentialsModal } from './RevokeBreakGlassCredentialsModal';

export function BreakGlassCredentialList() {
  const [credentialData, setCredentialData] = React.useState<BreakGlassCredential[]>([]);
  const [credential, setCredential] = React.useState<BreakGlassCredential | undefined>(undefined);
  const [error, setError] = React.useState<AxiosError>();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const clusterID = useGlobalState((state) => state.clusters.details.cluster.id);
  const canEdit = useGlobalState((state) => state.clusters.details.cluster.canEdit);

  React.useEffect(() => {
    setError(undefined);
    if (canEdit) {
      (async () => {
        const request = clusterService.getBreakGlassCredentials;
        try {
          const creds = await request(clusterID || '').then((response) => response.data);
          setCredentialData(creds?.items || []);
        } catch (error) {
          setError(error as AxiosError);
        }
      })();
    }
  }, [clusterID, credential?.id, isModalOpen, isDeleteModalOpen, isNewModalOpen, canEdit]);

  const handleDelete = (user: BreakGlassCredential | undefined) => {
    setIsDeleteModalOpen(true);
    setCredential(user);
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
  const defaultActions = (item: BreakGlassCredential): IAction[] => [
    {
      title: 'View Credentials',
      onClick: () => getCredentials(item),
    },
    {
      title: 'Revoke All Credentials',
      onClick: () => handleDelete(item),
    },
  ];

  const disableNewCredReason =
    !canEdit && 'You do not have permission to create new credentials for this cluster.';

  return (
    <>
      <ButtonWithTooltip
        className="access-control-add"
        variant="secondary"
        onClick={() => setIsNewModalOpen(true)}
        disableReason={disableNewCredReason}
      >
        New Credentials
      </ButtonWithTooltip>

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
      {error && (
        <ErrorBox
          message="A problem occurred while retrieving credential"
          response={{
            errorMessage: error?.message,
            operationID: error?.response?.status?.toString(),
          }}
        />
      )}
      {credentialData.length ? (
        <Table aria-label="break glass credential table" variant="compact">
          <Caption>Assigned Credentials</Caption>
          <Thead>
            <Tr>
              <Th>{columns.id}</Th>
              <Th>{columns.username}</Th>
              <Th>{columns.expiration_timestamp}</Th>
              <Th>{columns.status}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {credentialData?.map((cred) => {
              const rowActions: IAction[] | null = defaultActions(cred);

              return (
                <Tr key={cred.id}>
                  <Td>{cred.id}</Td>
                  <Td>{cred.username}</Td>
                  <Td>{new Date(cred.expiration_timestamp as string).toLocaleString('en-CA')}</Td>
                  <Td>{cred.status}</Td>
                  <Td isActionCell>
                    {cred.status !== 'revoked' && canEdit ? (
                      <ActionsColumn items={rowActions} />
                    ) : null}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      ) : null}
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
