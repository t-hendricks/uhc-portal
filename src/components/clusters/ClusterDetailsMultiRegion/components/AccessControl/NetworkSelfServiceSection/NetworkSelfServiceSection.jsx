import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  EmptyState,
  Icon,
  Popover,
  PopoverPosition,
  Title,
} from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import { HelpIcon } from '@patternfly/react-icons/dist/esm/icons/help-icon';
import { InProgressIcon } from '@patternfly/react-icons/dist/esm/icons/in-progress-icon';
import { UnknownIcon } from '@patternfly/react-icons/dist/esm/icons/unknown-icon';
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

import ButtonWithTooltip from '../../../../../common/ButtonWithTooltip';
import ClipboardCopyLinkButton from '../../../../../common/ClipboardCopyLinkButton';
import ErrorBox from '../../../../../common/ErrorBox';

class NetworkSelfServiceSection extends React.Component {
  state = { deletedRowIndex: undefined };

  componentDidMount() {
    const { getRoles, getGrants } = this.props;
    getRoles();
    getGrants();
  }

  componentDidUpdate(prevProps) {
    const { deleteGrantResponse, addGrantResponse, getGrants, grants, addNotification } =
      this.props;
    const { deletedRowIndex } = this.state;

    // fetch grants again after deleting or adding a grant
    if (
      ((deleteGrantResponse.fulfilled && prevProps.deleteGrantResponse.pending) ||
        (addGrantResponse.fulfilled && prevProps.addGrantResponse.pending)) &&
      !grants.pending
    ) {
      getGrants();
    }
    if (grants.fulfilled && prevProps.grants.pending && grants.data.length !== 0) {
      const prevGrants = prevProps.grants.data;
      const prevGrantsStates = prevGrants.reduce((states, grant) => {
        // eslint-disable-next-line no-param-reassign
        states[grant.id] = grant.state;
        return states;
      }, {});
      grants.data.forEach((grant) => {
        if (prevGrantsStates[grant.id] && grant.state !== prevGrantsStates[grant.id]) {
          if (grant.state === 'failed') {
            addNotification({
              variant: 'danger',
              title: `Role creation failed for ${grant.user_arn}`,
              description: grant.state_description,
              dismissDelay: 8000,
              dismissable: false,
            });
          } else if (grant.state === 'ready') {
            addNotification({
              variant: 'success',
              title: `${grant.roleName} role successfully created for ${grant.user_arn}`,
              dismissDelay: 8000,
              dismissable: false,
            });
          }
        }
      });
    }
    if (deletedRowIndex !== undefined && grants.fulfilled && prevProps.grants.pending) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ deletedRowIndex: undefined });
    }
  }

  render() {
    const {
      grants,
      deleteGrant,
      deleteGrantResponse,
      openAddGrantModal,
      canEdit,
      clusterHibernating,
      isReadOnly,
    } = this.props;
    const { deletedRowIndex } = this.state;

    const grantStatus = (status, description) => {
      let icon;
      let statusStr;
      switch (status) {
        case 'ready':
          icon = <CheckCircleIcon className="status-icon success" />;
          statusStr = 'Ready';
          break;
        case 'failed':
          icon = <ExclamationCircleIcon className="status-icon danger" />;
          statusStr = 'Failed';
          break;
        case 'pending':
          icon = <InProgressIcon className="status-icon" />;
          statusStr = 'Pending';
          break;
        case 'deleting':
          icon = <InProgressIcon className="status-icon" />;
          statusStr = 'Deleting';
          break;
        case 'removed':
          icon = <UnknownIcon className="status-icon" />;
          statusStr = 'Removed';
          break;
        default:
          icon = <UnknownIcon className="status-icon" />;
          statusStr = 'Unknown';
      }
      if (status === 'failed') {
        return (
          <span>
            <Popover
              position={PopoverPosition.top}
              bodyContent={description}
              aria-label="grant-failed"
            >
              <Button className="self-service-failed" variant="link" isInline icon={icon}>
                {statusStr}
              </Button>
            </Popover>
          </span>
        );
      }
      return (
        <>
          {icon} <span>{statusStr}</span>{' '}
        </>
      );
    };

    if (grants.error) {
      return (
        <EmptyState>
          <ErrorBox message="Error getting cluster users" response={grants} />
        </EmptyState>
      );
    }

    const loginAWSLink = (
      <a
        rel="noopener noreferrer"
        href="https://console.aws.amazon.com/console/home"
        target="_blank"
      >
        Log in to your aws account.
      </a>
    );

    const hasGrants = !!grants.data.length;

    const readOnlyReason = isReadOnly && 'This operation is not available during maintenance';
    const hibernatingReason =
      clusterHibernating && 'This operation is not available while cluster is hibernating';
    const canNotEditReason =
      !canEdit &&
      'You do not have permission to grant a role. Only cluster owners, cluster editors, and Organization Administrators can grant roles.';
    const disableReason = readOnlyReason || hibernatingReason || canNotEditReason;

    const addGrantBtn = (
      <ButtonWithTooltip
        onClick={() => {
          setTimeout(() => openAddGrantModal(), 0);
        }}
        variant="secondary"
        className="access-control-add"
        disableReason={disableReason}
      >
        Grant role
      </ButtonWithTooltip>
    );

    const columnNames = {
      arn: 'ARN',
      role: 'Role',
      status: 'Status',
      consoleUrl: 'AWS OSD console URL',
    };

    const actions = (grant, index) => [
      {
        title: 'Delete',
        onClick: () => {
          this.setState({ deletedRowIndex: index });
          deleteGrant(grant.id);
        },
      },
    ];

    const grantRow = (grant, index) => {
      const rowActions = actions(grant, index);
      return (
        <Tr key={grant.id}>
          <Td dataLabel={columnNames.arn}>{grant.user_arn}</Td>
          <Td dataLabel={columnNames.role}>{grant.roleName}</Td>
          <Td dataLabel={columnNames.status}>
            {grantStatus(
              deletedRowIndex === index ? 'deleting' : grant.state,
              grant.state_description,
            )}
          </Td>
          <Td dataLabel={columnNames.consoleUrl}>
            <ClipboardCopyLinkButton
              className="access-control-tables-copy"
              text={grant.console_url}
              isDisabled={!grant.console_url}
            >
              Copy URL to clipboard
            </ClipboardCopyLinkButton>
          </Td>
          <Td isActionCell>
            <ActionsColumn
              items={rowActions}
              isDisabled={grant.state === 'deleting' || !!disableReason}
            />
          </Td>
        </Tr>
      );
    };

    return grants.pending && !hasGrants ? (
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
      <Card id="networkSelfService">
        <CardBody>
          {deleteGrantResponse.error && (
            <ErrorBox message="Error deleting grant" response={deleteGrantResponse} />
          )}
          <Title size="lg" className="card-title" headingLevel="h3">
            AWS infrastructure access
          </Title>
          <p>
            Grant permission to view or manage the AWS infrastructure of the cluster to IAM users
            defined in your AWS account. {loginAWSLink}
            <ExternalLinkAltIcon color="#0066cc" size="sm" />
          </p>
          {hasGrants && (
            <Table aria-label="Grants" variant={TableVariant.compact}>
              <Thead>
                <Tr>
                  <Th>
                    <>
                      {columnNames.arn}
                      <Popover
                        position={PopoverPosition.top}
                        aria-label="ARNs"
                        bodyContent={
                          <p>Amazon Resource Names (ARNs) uniquely identify AWS resources.</p>
                        }
                      >
                        <Button variant="plain" isInline>
                          <Icon size="md">
                            <HelpIcon />
                          </Icon>
                        </Button>
                      </Popover>
                    </>
                  </Th>
                  <Th>{columnNames.role}</Th>
                  <Th>{columnNames.status}</Th>
                  <Th>{columnNames.consoleUrl}</Th>
                  <Th screenReaderText="Grant action" />
                </Tr>
              </Thead>
              <Tbody>{grants.data.map(grantRow)}</Tbody>
            </Table>
          )}
          {addGrantBtn}
        </CardBody>
      </Card>
    );
  }
}

NetworkSelfServiceSection.propTypes = {
  getRoles: PropTypes.func.isRequired,
  getGrants: PropTypes.func.isRequired,
  grants: PropTypes.object.isRequired,
  addGrantResponse: PropTypes.object,
  deleteGrant: PropTypes.func.isRequired,
  deleteGrantResponse: PropTypes.object,
  openAddGrantModal: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired,
  canEdit: PropTypes.bool.isRequired,
  clusterHibernating: PropTypes.bool.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
};

export default NetworkSelfServiceSection;
