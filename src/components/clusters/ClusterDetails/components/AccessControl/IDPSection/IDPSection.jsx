import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import {
  Card, Title, Button, CardBody, CardHeader, CardFooter,
} from '@patternfly/react-core';
import {
  Table,
  TableHeader,
  TableBody,
  TableVariant,
  cellWidth,
} from '@patternfly/react-table';
import {
  Skeleton,
} from '@redhat-cloud-services/frontend-components';
import ClipboardCopyLinkButton from '../../../../../common/ClipboardCopyLinkButton';

import links from '../../../../../../common/installLinks';
import { IDPTypeNames, getOauthCallbackURL, IDPNeedsOAuthURL } from '../../IdentityProvidersModal/IdentityProvidersHelper';

function IDPSection({
  clusterID, clusterConsoleURL, identityProviders, openModal,
}) {
  const columns = [
    { title: 'Name', transforms: [cellWidth(30)] },
    { title: 'Type', transforms: [cellWidth(30)] },
    { title: 'Auth Callback URL', transforms: [cellWidth(30)] },
  ];

  const actions = [
    {
      title: 'Delete',
      onClick: (_, __, rowData) => openModal('delete-idp', {
        clusterID,
        idpID:
        rowData.idpID,
        idpName: rowData.name.title,
        idpType: rowData.type.title,
      }),
    },
  ];

  const idpRow = idp => ({
    cells: [
      idp.name,
      get(IDPTypeNames, idp.type, idp.type),
      {
        title: IDPNeedsOAuthURL(idp.type) ? (
          <ClipboardCopyLinkButton className="idp-table-copy" text={getOauthCallbackURL(clusterConsoleURL, idp.name)}>
            Copy URL to clipboard
          </ClipboardCopyLinkButton>
        ) : 'N/A',
      },
    ],
    idpID: idp.id,
  });

  const learnMoreLink = <a rel="noopener noreferrer" href={links.UNDERSTANDING_IDENTITY_PROVIDER}>Learn more.</a>;

  const pending = !identityProviders.fulfilled && !identityProviders.error;

  const hasIDPs = !!identityProviders.clusterIDPList.length;

  return (
    pending ? (
      <Card>
        <CardHeader>
          <Skeleton size="md" />
        </CardHeader>
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
          <Title size="lg" headingLevel="h3">
            Identity Providers
          </Title>
          <p>
            Configure identity providers to allow users to log into the cluster.
            {' '}
            {learnMoreLink}
          </p>
          { hasIDPs && (
            <Table
              aria-label="Identity Providers"
              actions={actions}
              variant={TableVariant.compact}
              cells={columns}
              rows={identityProviders.clusterIDPList.map(idpRow)}
            >
              <TableHeader />
              <TableBody />
            </Table>
          )}
          <Button onClick={() => openModal('create-identity-provider')} variant="secondary" className="add-idp-button">
            Add identity provider
          </Button>
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
};

export default IDPSection;
