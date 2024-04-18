import React from 'react';
import { AxiosError } from 'axios';

import { ActionsColumn, IAction, Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import ErrorBox from '~/components/common/ErrorBox';
import { useGlobalState } from '~/redux/hooks';
import { clusterService } from '~/services';
import type { ExternalAuth } from '~/types/clusters_mgmt.v1';

import ButtonWithTooltip from '../../../../../common/ButtonWithTooltip';

import { DeleteExternalAuthProviderModal } from './DeleteExternalAuthProviderModal';
import { ExternalAuthProviderModal } from './ExternalAuthProviderModal';

export function ExternalAuthProviderList() {
  const [items, setItems] = React.useState<ExternalAuth[]>([]);
  const [error, setError] = React.useState<AxiosError>();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [editProvider, setEditProvider] = React.useState<ExternalAuth | undefined>(undefined);
  const clusterID = useGlobalState((state) => state.clusters.details.cluster.id);
  const canEdit = useGlobalState((state) => state.clusters.details.cluster.canEdit);

  React.useEffect(() => {
    (async () => {
      const request = clusterService.getExternalAuths;
      try {
        const providers = await request(clusterID || '').then((response) => response.data);
        setItems(providers?.items ?? []);
      } catch (error) {
        setError(error as AxiosError);
      }
    })();
  }, [clusterID, isModalOpen, isDeleteModalOpen]);

  const handleEdit = (provider: ExternalAuth | undefined) => {
    setIsModalOpen(true);
    setEditProvider(provider);
  };
  const handleDelete = (provider: ExternalAuth | undefined) => {
    setIsDeleteModalOpen(true);
    setEditProvider(provider);
  };
  const columns = { name: 'Name', issuer: 'Issuer URL', audiences: 'Audiences' };
  const defaultActions = (item: ExternalAuth): IAction[] => [
    {
      title: 'Edit',
      onClick: () => handleEdit(item),
    },
    {
      title: 'Delete',
      onClick: () => handleDelete(item),
    },
  ];

  const disableNewProviderReason =
    !canEdit && 'You do not have permission to create a new provider for this cluster.';

  return error ? (
    <ErrorBox
      message="A problem occurred while getting provider"
      response={{
        errorMessage: error?.message,
        operationID: error?.response?.status?.toString(),
      }}
    />
  ) : (
    <>
      {!items.length ? (
        <ButtonWithTooltip
          className="access-control-add"
          variant="secondary"
          onClick={() => setIsModalOpen(true)}
          disableReason={disableNewProviderReason}
        >
          Add external authentication provider
        </ButtonWithTooltip>
      ) : null}

      {isModalOpen ? (
        <ExternalAuthProviderModal
          clusterID={clusterID || ''}
          onClose={() => {
            setIsModalOpen(false);
            setEditProvider(undefined);
          }}
          externalAuthProvider={editProvider}
          isEdit={!!editProvider}
        />
      ) : null}
      {items.length ? (
        <Table aria-label="External authentication providers table" variant="compact">
          <Thead>
            <Tr>
              <Th>{columns.name}</Th>
              <Th>{columns.issuer}</Th>
              <Th>{columns.audiences}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items?.map((provider: ExternalAuth) => {
              const rowActions: IAction[] | null = defaultActions(provider);

              return (
                <Tr key={provider.id}>
                  <Td>{provider.id}</Td>
                  <Td>{provider.issuer?.url ?? ''}</Td>
                  <Td>{provider.issuer?.audiences?.join(', ') ?? ''}</Td>
                  <Td isActionCell>{canEdit && <ActionsColumn items={rowActions} />}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      ) : null}
      {isDeleteModalOpen ? (
        <DeleteExternalAuthProviderModal
          externalAuthProvider={editProvider ?? undefined}
          clusterId={clusterID || ''}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setEditProvider(undefined);
          }}
        />
      ) : null}
    </>
  );
}
