import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import {
  Card, Title, Button, CardBody, CardHeader, CardFooter,
  Bullseye, EmptyState, EmptyStateBody, EmptyStateVariant,
} from '@patternfly/react-core';
import {
  Table,
  TableHeader,
  TableBody,
  TableVariant,
} from '@patternfly/react-table';
import {
  Skeleton,
} from '@redhat-cloud-services/frontend-components';

import links from '../../../../../../common/installLinks';
import { IDPTypeNames } from '../../IdentityProvidersModal/IdentityProvidersHelper';

function IDPSection({ clusterID, identityProviders, openModal }) {
  const columns = [
    'Name',
    'Type',
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
    ],
    idpID: idp.id,
  });

  const learnMoreLink = <a rel="noopener noreferrer" href={links.UNDERSTANDING_IDENTITY_PROVIDER}>Learn more.</a>;

  const tableEmptyState = [
    {
      heightAuto: true,
      cells: [
        {
          props: { colSpan: columns.length },
          title: (
            <Bullseye>
              <EmptyState variant={EmptyStateVariant.small}>
                <Title headingLevel="h2" size="lg">
                  No Identity Providers Exist
                </Title>
                <EmptyStateBody>
                  Identity providers determine how users log into the cluster.
                  {' '}
                  {learnMoreLink}
                </EmptyStateBody>
              </EmptyState>
            </Bullseye>
          ),
        },
      ],
    },
  ];

  const pending = !identityProviders.fulfilled && !identityProviders.error;

  const hasIDPs = !!identityProviders.clusterIDPList.length;
  const rows = hasIDPs ? identityProviders.clusterIDPList.map(idpRow) : tableEmptyState;

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
          <Table aria-label="Identity Providers" actions={hasIDPs ? actions : []} variant={TableVariant.compact} cells={columns} rows={rows}>
            <TableHeader />
            <TableBody />
          </Table>
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
  identityProviders: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
};

export default IDPSection;
