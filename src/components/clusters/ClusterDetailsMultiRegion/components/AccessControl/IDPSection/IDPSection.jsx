import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import {
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  Stack,
  StackItem,
  Title,
  Tooltip,
} from '@patternfly/react-core';
import {
  ActionsColumn,
  Table,
  TableVariant,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';
import Skeleton from '@redhat-cloud-services/frontend-components/Skeleton';

import { useNavigate } from '~/common/routing';
import { useFetchClusterIdentityProviders } from '~/queries/ClusterDetailsQueries/useFetchClusterIdentityProviders';

import links from '../../../../../../common/installLinks.mjs';
import ClipboardCopyLinkButton from '../../../../../common/ClipboardCopyLinkButton';
import { modalActions } from '../../../../../common/Modal/ModalActions';
import {
  getOauthCallbackURL,
  IDPformValues,
  IDPNeedsOAuthURL,
  IDPTypeNames,
} from '../../IdentityProvidersPage/IdentityProvidersHelper';

const IDPSection = (props) => {
  const {
    clusterID,
    clusterUrls,
    idpActions = {},
    clusterHibernating,
    isReadOnly,
    isHypershift,
    subscriptionID,
    cluster,
  } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const region = cluster?.subscription?.xcm_id;

  const {
    clusterIdentityProviders: identityProvidersData,
    isLoading: isIdentityProvidersLoading,
    isError: isIdentityProvidersError,
  } = useFetchClusterIdentityProviders(clusterID, region);

  const identityProviders = identityProvidersData?.items;

  const learnMoreLink = (
    <a rel="noopener noreferrer" href={links.UNDERSTANDING_IDENTITY_PROVIDER} target="_blank">
      Learn more.
    </a>
  );

  const pending = isIdentityProvidersLoading && !isIdentityProvidersError;

  const hasIDPs = !!identityProviders?.length;

  const readOnlyReason = isReadOnly && 'This operation is not available during maintenance';
  const hibernatingReason =
    clusterHibernating && 'This operation is not available while cluster is hibernating';
  const notAllowedReason = (action) =>
    `You do not have permission to ${action} an identity provider. Only cluster owners, cluster editors, identity provider editors, and Organization Administrators can ${action} identity providers.`;
  const disableReason = readOnlyReason || hibernatingReason;
  const cannotCreateReason = disableReason || (!idpActions.create && notAllowedReason('add'));

  const IDPDropdownOptions = (
    <DropdownList>
      {Object.values(IDPTypeNames).map((idpName) => (
        <DropdownItem
          key={idpName}
          onClick={() =>
            navigate(`/details/s/${subscriptionID}/add-idp/${idpName.toLowerCase()}`, {
              state: {
                cluster,
                clusterIDPs: identityProviders,
                subscriptionID,
              },
            })
          }
        >
          {idpName}
        </DropdownItem>
      ))}
    </DropdownList>
  );

  const toggleRef = useRef();

  let addIDPDropdown = (
    <Dropdown
      isOpen={dropdownOpen}
      onOpenChange={(isOpen) => setDropdownOpen(isOpen)}
      toggle={{
        toggleRef,
        toggleNode: (
          <MenuToggle
            id="add-identity-provider"
            ref={toggleRef}
            isDisabled={cannotCreateReason}
            isExpanded={dropdownOpen}
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
            }}
          >
            Add identity provider
          </MenuToggle>
        ),
      }}
    >
      {IDPDropdownOptions}
    </Dropdown>
  );
  if (cannotCreateReason) {
    addIDPDropdown = <Tooltip content={cannotCreateReason}>{addIDPDropdown}</Tooltip>;
  }

  const columnNames = {
    name: 'Name',
    type: 'Type',
    callbackUrl: 'Auth callback URL',
  };

  const idpActionResolver = (idp) => {
    const editIDPAction = {
      title: 'Edit',
      isAriaDisabled: !idpActions.update,
      onClick: () => {
        navigate(`/details/s/${subscriptionID}/edit-idp/${idp.name}`);
      },
    };
    const deleteIDPAction = {
      title: 'Delete',
      isAriaDisabled: !idpActions.delete,
      onClick: () => {
        dispatch(
          modalActions.openModal('delete-idp', {
            clusterID,
            idpID: idp.id,
            idpName: idp.name,
            idpType: IDPTypeNames[idp.type],
            region,
          }),
        );
      },
    };
    if (IDPTypeNames[idp.type] === IDPTypeNames[IDPformValues.HTPASSWD]) {
      return [deleteIDPAction];
    }
    return [editIDPAction, deleteIDPAction];
  };

  const idpRow = (idp) => {
    const actions = idpActionResolver(idp);
    return (
      <Tr key={idp.id}>
        <Td dataLabel={columnNames.name}>{idp.name}</Td>
        <Td dataLabel={columnNames.type}>{IDPTypeNames[idp.type] ?? idp.type}</Td>
        <Td dataLabel={columnNames.callbackUrl}>
          {IDPNeedsOAuthURL(idp.type) ? (
            <ClipboardCopyLinkButton
              className="access-control-tables-copy"
              text={getOauthCallbackURL(clusterUrls, idp.name, isHypershift)}
            >
              Copy URL to clipboard
            </ClipboardCopyLinkButton>
          ) : (
            'N/A'
          )}
        </Td>
        <Td isActionCell>
          <ActionsColumn items={actions} isDisabled={!!disableReason} />
        </Td>
      </Tr>
    );
  };

  return pending ? (
    <Card>
      <CardTitle>
        <Skeleton size="md" />
      </CardTitle>
      <CardBody>
        <Skeleton size="lg" />
      </CardBody>
      <CardFooter>
        <Skeleton size="md" />
      </CardFooter>
    </Card>
  ) : (
    <Card>
      <CardBody>
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h2" size="lg" className="card-title">
              Identity providers
            </Title>
            <p>
              Configure identity providers to allow users to log into the cluster. {learnMoreLink}
            </p>
          </StackItem>
          <StackItem>{addIDPDropdown}</StackItem>
          <StackItem>
            {hasIDPs && idpActions.list && (
              <Table aria-label="Identity Providers" variant={TableVariant.compact}>
                <Thead>
                  <Tr>
                    <Th width={30}>{columnNames.name}</Th>
                    <Th width={30}>{columnNames.type}</Th>
                    <Th width={30}>{columnNames.callbackUrl}</Th>
                    <Th screenReaderText="Action" />
                  </Tr>
                </Thead>
                <Tbody>{identityProviders.map(idpRow)}</Tbody>
              </Table>
            )}
          </StackItem>
        </Stack>
      </CardBody>
    </Card>
  );
};

IDPSection.propTypes = {
  cluster: PropTypes.object,
  clusterID: PropTypes.string,
  clusterUrls: PropTypes.shape({
    console: PropTypes.string,
    api: PropTypes.string,
  }),
  idpActions: PropTypes.shape({
    get: PropTypes.bool,
    list: PropTypes.bool,
    create: PropTypes.bool,
    update: PropTypes.bool,
    delete: PropTypes.bool,
  }),
  clusterHibernating: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isHypershift: PropTypes.bool,
  subscriptionID: PropTypes.string,
};

export default IDPSection;
