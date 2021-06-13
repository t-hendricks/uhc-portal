import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import {
  Card, Title, Button, CardBody, CardFooter, Tooltip, CardTitle,
} from '@patternfly/react-core';
import {
  Table,
  TableHeader,
  TableBody,
  TableVariant,
  cellWidth,
} from '@patternfly/react-table';
import Skeleton from '@redhat-cloud-services/frontend-components/Skeleton';
import ClipboardCopyLinkButton from '../../../../../common/ClipboardCopyLinkButton';

import links from '../../../../../../common/installLinks';
import {
  IDPTypeNames, getOauthCallbackURL, IDPNeedsOAuthURL, IDPformValues,
} from '../../IdentityProvidersModal/IdentityProvidersHelper';

function IDPSection({
  clusterID, clusterConsoleURL, identityProviders, openModal, canEdit, clusterHibernating,
}) {
  const columns = [
    { title: 'Name', transforms: [cellWidth(30)] },
    { title: 'Type', transforms: [cellWidth(30)] },
    { title: 'Auth callback URL', transforms: [cellWidth(30)] },
  ];

  const idpRow = idp => ({
    cells: [
      idp.name,
      get(IDPTypeNames, idp.type, idp.type),
      {
        title: IDPNeedsOAuthURL(idp.type) ? (
          <ClipboardCopyLinkButton className="access-control-tables-copy" text={getOauthCallbackURL(clusterConsoleURL, idp.name)}>
            Copy URL to clipboard
          </ClipboardCopyLinkButton>
        ) : 'N/A'
        ,
      },
    ],
    idpID: idp.id,
  });

  const idpActionResolver = (rowData) => {
    const editIDPAction = {
      title: 'Edit',
      onClick: (_, rowId, row) => openModal('create-identity-provider', {
        clusterID,
        idpID: row.idpID,
        isEditForm: true,
        rowId,
      }),
      className: 'hand-pointer',
    };
    const deleteIDPAction = {
      title: 'Delete',
      onClick: (_, __, row) => openModal('delete-idp', {
        clusterID,
        idpID: row.idpID,
        idpName: row.name.title,
        idpType: row.type.title,
      }),
      className: 'hand-pointer',
    };
    if (rowData.type.title === IDPTypeNames[IDPformValues.HTPASSWD]) {
      return [deleteIDPAction];
    }
    return [editIDPAction, deleteIDPAction];
  };

  const learnMoreLink = <a rel="noopener noreferrer" href={links.UNDERSTANDING_IDENTITY_PROVIDER} target="_blank">Learn more.</a>;

  const pending = (!identityProviders.fulfilled && !identityProviders.error)
                  || identityProviders.pending;

  const hasIDPs = !!identityProviders.clusterIDPList.length;

  const disabled = !canEdit || clusterHibernating;

  const tooltipContent = clusterHibernating ? 'This operation is not available while cluster is hibernating'
    : 'You do not have permission to add an identity provider. Only cluster owners and organization administrators can add identity providers.';

  const addIdpBtn = (
    <Button onClick={() => openModal('create-identity-provider')} variant="secondary" className="access-control-add" isDisabled={disabled}>
      Add identity provider
    </Button>
  );

  return (
    pending ? (
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
          <Title headingLevel="h2" size="lg" className="card-title">
            Identity providers
          </Title>
          <p>
            Configure identity providers to allow users to log into the cluster.
            {' '}
            {learnMoreLink}
          </p>
          { hasIDPs && (
            <Table
              aria-label="Identity Providers"
              actionResolver={idpActionResolver}
              variant={TableVariant.compact}
              cells={columns}
              rows={identityProviders.clusterIDPList.map(idpRow)}
              areActionsDisabled={() => disabled}
            >
              <TableHeader />
              <TableBody />
            </Table>
          )}
          {disabled ? (
            <Tooltip content={tooltipContent}>
              <span>
                {addIdpBtn}
              </span>
            </Tooltip>
          )
            : addIdpBtn}
        </CardBody>
      </Card>
    )
  );
}

IDPSection.propTypes = {
  clusterID: PropTypes.string.isRequired,
  clusterConsoleURL: PropTypes.string.isRequired,
  identityProviders: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  canEdit: PropTypes.bool.isRequired,
  clusterHibernating: PropTypes.bool.isRequired,
};

export default IDPSection;
