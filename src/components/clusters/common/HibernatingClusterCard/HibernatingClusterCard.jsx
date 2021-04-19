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
  Button,
} from '@patternfly/react-core';

import { AsleepIcon, InProgressIcon } from '@patternfly/react-icons';
import clusterStates from '../clusterStates';
import modals from '../../../common/Modal/modals';

function HibernatingClusterCard({ cluster, openModal }) {
  let icon;
  let title;
  let body;
  let button;

  const openResumeClusterModal = () => {
    const clusterData = {
      clusterID: cluster.id,
      clusterName: cluster.name,
      subscriptionID: cluster.subscription.id,
    };
    openModal(modals.RESUME_CLUSTER, clusterData);
  };

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
      button = (
        <Button variant="link" isDisabled onClick={openResumeClusterModal}>Resume from Hibernation</Button>
      );
      break;
    default:
      title = 'Cluster is currently hibernating';
      body = 'The cluster is not utilizing any infrastructure and all operations will not be available';
      icon = AsleepIcon;
      button = (
        <Button variant="link" disabled={!cluster.canEdit} onClick={openResumeClusterModal}>Resume from Hibernation</Button>
      );
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
            {button}
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
