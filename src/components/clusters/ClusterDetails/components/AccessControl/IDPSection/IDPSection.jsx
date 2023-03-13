import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Link } from 'react-router-dom';

import {
  Card,
  Title,
  CardBody,
  CardFooter,
  CardTitle,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  Stack,
  StackItem,
  Tooltip,
} from '@patternfly/react-core';
import { Table, TableHeader, TableBody, TableVariant, cellWidth } from '@patternfly/react-table';
import Skeleton from '@redhat-cloud-services/frontend-components/Skeleton';
import ClipboardCopyLinkButton from '../../../../../common/ClipboardCopyLinkButton';

import links from '../../../../../../common/installLinks.mjs';
import {
  IDPTypeNames,
  getOauthCallbackURL,
  IDPNeedsOAuthURL,
  IDPformValues,
} from '../../IdentityProvidersPage/IdentityProvidersHelper';

class IDPSection extends React.Component {
  state = { dropdownOpen: false };

  render() {
    const {
      clusterID,
      subscriptionID,
      clusterUrls,
      identityProviders,
      openModal,
      canEdit,
      clusterHibernating,
      isReadOnly,
      isHypershift,
      history,
    } = this.props;

    const columns = [
      { title: 'Name', transforms: [cellWidth(30)] },
      { title: 'Type', transforms: [cellWidth(30)] },
      { title: 'Auth callback URL', transforms: [cellWidth(30)] },
    ];

    const idpRow = (idp) => ({
      cells: [
        idp.name,
        get(IDPTypeNames, idp.type, idp.type),
        {
          title: IDPNeedsOAuthURL(idp.type) ? (
            <ClipboardCopyLinkButton
              className="access-control-tables-copy"
              text={getOauthCallbackURL(clusterUrls, idp.name, isHypershift)}
            >
              Copy URL to clipboard
            </ClipboardCopyLinkButton>
          ) : (
            'N/A'
          ),
        },
      ],
      idpID: idp.id,
      idpName: idp.name,
      idpTypeName: idp.type,
    });

    const idpActionResolver = (rowData) => {
      const editIDPAction = {
        title: 'Edit',
        onClick: (_, rowId, row) => {
          history.push(`/details/s/${subscriptionID}/edit-idp/${row.idpName}`);
        },
        className: 'hand-pointer',
      };
      const deleteIDPAction = {
        title: 'Delete',
        onClick: (_, __, row) =>
          openModal('delete-idp', {
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

    const learnMoreLink = (
      <a rel="noopener noreferrer" href={links.UNDERSTANDING_IDENTITY_PROVIDER} target="_blank">
        Learn more.
      </a>
    );

    const pending =
      (!identityProviders.fulfilled && !identityProviders.error) || identityProviders.pending;

    const hasIDPs = !!identityProviders.clusterIDPList.length;

    const readOnlyReason = isReadOnly && 'This operation is not available during maintenance';
    const hibernatingReason =
      clusterHibernating && 'This operation is not available while cluster is hibernating';
    const canNotEditReason =
      !canEdit &&
      'You do not have permission to add an identity provider. Only cluster owners, cluster editors, and Organization Administrators can add identity providers.';
    const disableReason = readOnlyReason || hibernatingReason || canNotEditReason;

    const IDPDropdownOptions = Object.values(IDPTypeNames).map((idpName) => (
      <DropdownItem
        component={
          <Link
            to={{
              pathname: `/details/s/${subscriptionID}/add-idp/${idpName.toLowerCase()}`,
              state: { allLoaded: true },
            }}
          >
            {idpName}
          </Link>
        }
      />
    ));
    const { dropdownOpen } = this.state;
    let addIDPDropdown = (
      <Dropdown
        toggle={
          <DropdownToggle
            id="add-identity-provider"
            isDisabled={disableReason}
            onToggle={(isOpen) => {
              this.setState({ dropdownOpen: isOpen });
            }}
          >
            Add identity provider
          </DropdownToggle>
        }
        isOpen={dropdownOpen}
        dropdownItems={IDPDropdownOptions}
      />
    );
    if (disableReason) {
      addIDPDropdown = <Tooltip content={disableReason}>{addIDPDropdown}</Tooltip>;
    }

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
              {hasIDPs && (
                <Table
                  aria-label="Identity Providers"
                  actionResolver={idpActionResolver}
                  variant={TableVariant.compact}
                  cells={columns}
                  rows={identityProviders.clusterIDPList.map(idpRow)}
                  areActionsDisabled={() => !!disableReason}
                >
                  <TableHeader />
                  <TableBody />
                </Table>
              )}
            </StackItem>
          </Stack>
        </CardBody>
      </Card>
    );
  }
}

IDPSection.propTypes = {
  clusterID: PropTypes.string.isRequired,
  subscriptionID: PropTypes.string.isRequired,
  clusterUrls: PropTypes.shape({
    console: PropTypes.string,
    api: PropTypes.string,
  }).isRequired,
  identityProviders: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  canEdit: PropTypes.bool.isRequired,
  clusterHibernating: PropTypes.bool.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  isHypershift: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default IDPSection;
