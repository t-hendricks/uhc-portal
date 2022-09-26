import React from 'react';
import PropTypes from 'prop-types';
import {
  EmptyState,
  Title,
  Button,
  Popover,
  PopoverPosition,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
} from '@patternfly/react-core';
import { Table, TableHeader, TableBody, TableVariant } from '@patternfly/react-table';

import {
  HelpIcon,
  ExternalLinkAltIcon,
  ExclamationCircleIcon,
  InProgressIcon,
  UnknownIcon,
  CheckCircleIcon,
} from '@patternfly/react-icons';

import Skeleton from '@redhat-cloud-services/frontend-components/Skeleton';
import ErrorBox from '../../../../../common/ErrorBox';
import ClipboardCopyLinkButton from '../../../../../common/ClipboardCopyLinkButton';
import ButtonWithTooltip from '../../../../../common/ButtonWithTooltip';

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

    const columns = [
      {
        title: (
          <>
            ARN
            <Popover
              position={PopoverPosition.top}
              aria-label="ARNs"
              bodyContent={<p>Amazon Resource Names (ARNs) uniquely identify AWS resources.</p>}
            >
              <Button variant="plain" isInline>
                <HelpIcon size="sm" />
              </Button>
            </Popover>
          </>
        ),
      },
      {
        title: 'Role',
      },
      {
        title: 'Status',
      },
      {
        title: 'AWS OSD console URL',
      },
    ];

    const actions = [
      {
        title: 'Delete',
        onClick: (_, rowId, rowData) => {
          this.setState({ deletedRowIndex: rowId });
          deleteGrant(rowData.grantId);
        },
        className: 'hand-pointer',
      },
    ];

    const grantRow = (grant, index) => ({
      cells: [
        grant.user_arn,
        grant.roleName,
        {
          title: grantStatus(
            deletedRowIndex === index ? 'deleting' : grant.state,
            grant.state_description,
          ),
        },
        {
          title: (
            <>
              <ClipboardCopyLinkButton
                className="access-control-tables-copy"
                text={grant.console_url}
                isDisabled={!grant.console_url}
              >
                Copy URL to clipboard
              </ClipboardCopyLinkButton>
            </>
          ),
        },
      ],
      grantId: grant.id,
      state: grant.state,
    });

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

    const rows = hasGrants && grants.data.map(grantRow);

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
      <>
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
              <Table
                aria-label="Grants"
                actions={actions}
                variant={TableVariant.compact}
                cells={columns}
                rows={rows}
                areActionsDisabled={(rowData) => rowData.state === 'deleting' || !!disableReason}
              >
                <TableHeader />
                <TableBody />
              </Table>
            )}
            {addGrantBtn}
          </CardBody>
        </Card>
      </>
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
