import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardBody,
  EmptyState,
  EmptyStateIcon,
  EmptyStateVariant,
  EmptyStateBody,
  EmptyStateActions,
  EmptyStateHeader,
  EmptyStateFooter,
} from '@patternfly/react-core';
import { AsleepIcon } from '@patternfly/react-icons/dist/esm/icons/asleep-icon';
import { InProgressIcon } from '@patternfly/react-icons/dist/esm/icons/in-progress-icon';

import clusterStates from '../clusterStates';
import modals from '../../../common/Modal/modals';
import ButtonWithTooltip from '../../../common/ButtonWithTooltip';

function HibernatingClusterCard({ cluster, openModal }) {
  let icon;
  let title;
  let body;
  let showButton = false;
  let buttonDisableReason = null;

  const openResumeClusterModal = () => {
    const clusterData = {
      clusterID: cluster.id,
      clusterName: cluster.name,
      subscriptionID: cluster.subscription.id,
    };
    openModal(modals.RESUME_CLUSTER, clusterData);
  };

  const isReadOnly = cluster?.status?.configuration_mode === 'read_only';
  const readOnlyReason = isReadOnly && 'This operation is not available during maintenance';
  const canNotEditReason =
    !cluster.canEdit &&
    'You do not have permission to resume from hibernation. Only cluster owners, cluster editors, and Organization Administrators can change hibernation state.';

  switch (cluster.state) {
    case clusterStates.RESUMING:
      title = 'Cluster is resuming from hibernation';
      body = 'This might take a few minutes!';
      icon = InProgressIcon;
      break;
    case clusterStates.POWERING_DOWN:
      title = 'Cluster is powering down and moving to a hibernating state';
      body =
        'The cluster will not utilize any infrastructure and all operations will not be available';
      icon = InProgressIcon;
      break;
    default:
      title = 'Cluster is currently hibernating';
      body =
        'The cluster is not utilizing any infrastructure and all operations will not be available';
      icon = AsleepIcon;
      showButton = true;
      buttonDisableReason = readOnlyReason || canNotEditReason;
      break;
  }

  return (
    <Card>
      <CardBody>
        <EmptyState variant={EmptyStateVariant.sm}>
          <EmptyStateHeader
            titleText={title}
            icon={<EmptyStateIcon icon={icon} />}
            headingLevel="h4"
          />
          <EmptyStateBody>{body}</EmptyStateBody>
          <EmptyStateFooter>
            <EmptyStateActions>
              {showButton && (
                <ButtonWithTooltip
                  variant="link"
                  disableReason={buttonDisableReason}
                  onClick={openResumeClusterModal}
                >
                  Resume from Hibernation
                </ButtonWithTooltip>
              )}
            </EmptyStateActions>
          </EmptyStateFooter>
        </EmptyState>
      </CardBody>
    </Card>
  );
}

HibernatingClusterCard.propTypes = {
  cluster: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
};

export default HibernatingClusterCard;
