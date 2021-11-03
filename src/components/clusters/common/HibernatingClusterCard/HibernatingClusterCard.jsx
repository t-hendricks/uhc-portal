import React from 'react';
import PropTypes from 'prop-types';
import './HibernatingClusterCard.scss';

import {
  Card,
  CardBody,
  EmptyState,
  Title,
  EmptyStateIcon,
  EmptyStateVariant,
  EmptyStateBody,
  EmptyStateSecondaryActions,
} from '@patternfly/react-core';

import { AsleepIcon, InProgressIcon } from '@patternfly/react-icons';
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
  const canNotEditReason = !cluster.canEdit && 'You do not have permission to resume from hibernation. Only cluster owners, cluster editors, and organization administrators can change hibernation state.';

  switch (cluster.state) {
    case clusterStates.RESUMING:
      title = 'Cluster is resuming from hibernation';
      body = 'This might take a few minutes!';
      icon = InProgressIcon;
      break;
    case clusterStates.POWERING_DOWN:
      title = 'Cluster is powering down and moving to a hibernating state';
      body = 'The cluster will not utilize any infrastructure and all operations will not be available';
      icon = InProgressIcon;
      showButton = true;
      buttonDisableReason = 'This cluster is powering down; you will be able to resume after it reaches hibernating state.';
      break;
    default:
      title = 'Cluster is currently hibernating';
      body = 'The cluster is not utilizing any infrastructure and all operations will not be available';
      icon = AsleepIcon;
      showButton = true;
      buttonDisableReason = readOnlyReason || canNotEditReason;
      break;
  }

  return (
    <Card id="hibernatingClusterCard">
      <CardBody>
        <EmptyState variant={EmptyStateVariant.large}>
          <EmptyStateIcon className="status-icon" icon={icon} />
          <Title headingLevel="h4" size="lg">
            {title}
          </Title>
          <EmptyStateBody>
            {body}
          </EmptyStateBody>
          <EmptyStateSecondaryActions>
            {showButton && (
              <ButtonWithTooltip variant="link" disableReason={buttonDisableReason} onClick={openResumeClusterModal}>
                Resume from Hibernation
              </ButtonWithTooltip>
            )}
          </EmptyStateSecondaryActions>
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
