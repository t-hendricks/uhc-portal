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
  CardHeader,
  CardFooter,
} from '@patternfly/react-core';
import {
  Table,
  TableHeader,
  TableBody,
  TableVariant,
} from '@patternfly/react-table';

import {
  HelpIcon,
  ExternalLinkAltIcon,
  ExclamationCircleIcon,
  InProgressIcon,
  UnknownIcon,
  CheckCircleIcon,
} from '@patternfly/react-icons';

// eslint-disable-next-line camelcase
import { global_success_color_100, global_danger_color_100 } from '@patternfly/react-tokens';
import { Skeleton } from '@redhat-cloud-services/frontend-components';

import ErrorBox from '../../../../../common/ErrorBox';
import ClipboardCopyLinkButton from '../../../../../common/ClipboardCopyLinkButton';

class NetworkSelfServiceSection extends React.Component {
  componentDidMount() {
    const { getRoles, getGrants } = this.props;
    getRoles();
    getGrants();
  }

  componentDidUpdate(prevProps) {
    const {
      deleteGrantResponse, addGrantResponse, getGrants,
    } = this.props;
    // fetch grants again after deleting or adding a grant
    if (((deleteGrantResponse.fulfilled && prevProps.deleteGrantResponse.pending)
      || (addGrantResponse.fulfilled && prevProps.addGrantResponse.pending))
      && !getGrants.pending) {
      getGrants();
    }
  }

  render() {
    const {
      grants,
      deleteGrant,
      deleteGrantResponse,
      openAddGrantModal,
    } = this.props;


    const grantStatus = (status) => {
      let icon;
      let statusStr;
      switch (status) {
        case 'ready':
          icon = <CheckCircleIcon className="status-icon" color={global_success_color_100.value} size="md" />;
          statusStr = 'Ready';
          break;
        case 'failed':
          icon = <ExclamationCircleIcon className="status-icon" color={global_danger_color_100.value} size="md" />;
          statusStr = 'Failed';
          break;
        case 'pending':
          icon = <InProgressIcon className="status-icon" size="md" />;
          statusStr = 'Pending';
          break;
        case 'deleting':
          icon = <InProgressIcon className="status-icon" size="md" />;
          statusStr = 'Deleting';
          break;
        case 'removed':
          icon = <UnknownIcon className="status-icon" size="md" />;
          statusStr = 'Removed';
          break;
        default:
          icon = <UnknownIcon className="status-icon" size="md" />;
          statusStr = 'Unknown';
      }
      return (
        <>
          {icon}
          <span>{statusStr}</span>
          {' '}
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
              bodyContent={(
                <p>
                  Amazon Resource Names (ARNs) uniquely identify AWS resources.
                </p>
              )}
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
        title: 'AWS OSD Console URL',
      },
    ];

    const actions = [
      {
        title: 'Delete',
        onClick: (_, rowId, rowData) => deleteGrant(rowData.grantId),
        component: 'a',
      },
    ];

    const grantRow = grant => ({
      cells: [
        grant.user_arn,
        grant.roleName,
        { title: grantStatus(grant.state) },
        {
          title: (
            <>
              <ClipboardCopyLinkButton className="access-control-tables-copy" text={grant.console_url} isDisabled={!grant.console_url}>
                Copy URL to clipboard
              </ClipboardCopyLinkButton>
            </>),
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

    const loginAWSLink = <a rel="noopener noreferrer" href="https://console.aws.amazon.com/console/home" target="_blank">Log in to your aws account.</a>;

    const hasGrants = !!grants.data.length;

    const rows = hasGrants && grants.data.map(grantRow);

    return grants.pending && !hasGrants ? (
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
      <>
        <Card id="networkSelfService">
          <CardBody>
            { deleteGrantResponse.error && (
            <ErrorBox message="Error deleting grant" response={deleteGrantResponse} />
            )}
            <Title size="lg" headingLevel="h3">AWS infrastructure access</Title>
            <p>
            Grant permission to view or manage the AWS infrastructure of the cluster to
            IAM users defined in your AWS account.
              {' '}
              {loginAWSLink}
              <ExternalLinkAltIcon color="#0066cc" size="sm" />
            </p>
            { hasGrants && (
            <Table aria-label="Grants" actions={actions} variant={TableVariant.compact} cells={columns} rows={rows} areActionsDisabled={rowData => rowData.state === 'deleting'}>
              <TableHeader />
              <TableBody />
            </Table>
            )}
            <Button onClick={() => openAddGrantModal()} variant="secondary" className="access-control-add">
              Grant role
            </Button>
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
};

export default NetworkSelfServiceSection;
