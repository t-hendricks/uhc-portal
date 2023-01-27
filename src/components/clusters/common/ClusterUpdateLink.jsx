import React from 'react';
import PropTypes from 'prop-types';
import { Button, Popover } from '@patternfly/react-core';
import { InfoCircleIcon, OutlinedArrowAltCircleUpIcon } from '@patternfly/react-icons';
import { isHibernating } from './clusterStates';
import links from '../../../common/installLinks.mjs';
import getClusterName from '../../../common/getClusterName';
import modals from '../../common/Modal/modals';
import { subscriptionStatuses } from '../../../common/subscriptionTypes';
import { isHypershiftCluster } from '../ClusterDetails/clusterDetailsHelper';

const ClusterUpdateLink = ({ cluster, openModal, hideOSDUpdates }) => {
  const { upgrade } = cluster.metrics;
  // eslint-disable-next-line camelcase
  const osdUpgradeAvailable =
    cluster.managed &&
    cluster.version?.available_upgrades?.length > 0 &&
    cluster.openshift_version &&
    !hideOSDUpdates;
  const isStale = cluster?.subscription?.status === subscriptionStatuses.STALE;

  // Show which version the cluster is currently updating to
  if (
    upgrade?.state === 'running' &&
    upgrade?.version &&
    cluster.version?.raw_id !== upgrade.version
  ) {
    return (
      <span>
        {' '}
        &rarr;
        {` ${upgrade.version}`}
      </span>
    );
  }

  // Only show Update tooltip/link for OSD clusters when the feature toggle is enabled
  // or OCP clusters that have available updates
  if (
    (cluster.managed &&
      (!cluster.canEdit || !osdUpgradeAvailable || isHibernating(cluster.state) || isStale)) ||
    (!cluster.managed && (!upgrade.available || isStale))
  ) {
    return null;
  }

  // Only show update for non hypershift clusters
  if (isHypershiftCluster(cluster)) {
    return null;
  }

  if (cluster.managed) {
    return (
      <Button
        className="cluster-update-link pf-u-mt-0"
        variant="link"
        onClick={() =>
          openModal(modals.UPGRADE_WIZARD, {
            clusterName: getClusterName(cluster),
            subscriptionID: cluster.subscription.id,
          })
        }
        icon={<OutlinedArrowAltCircleUpIcon />}
      >
        Update
      </Button>
    );
  }

  // Display a link to the cluster settings page in the console
  if (cluster.console && cluster.console.url) {
    return (
      <a href={`${cluster.console.url}/settings/cluster`} target="_blank" rel="noopener noreferrer">
        <Button
          className="cluster-update-link pf-u-mt-0"
          variant="link"
          icon={<OutlinedArrowAltCircleUpIcon />}
        >
          Update
        </Button>
      </a>
    );
  }

  // If console link is not available, display a popover with data about the update
  return (
    <Popover
      position="top"
      aria-label="Update"
      bodyContent={
        <div>
          An update is available for this cluster. Navigate to the Cluster settings page in the
          cluster&apos;s web console to update.{' '}
          <a href={links.UPDATING_CLUSTER} target="_blank" rel="noreferrer noopener">
            Learn more
          </a>
        </div>
      }
    >
      <Button className="cluster-update-link pf-u-mt-0" variant="link" icon={<InfoCircleIcon />}>
        Update
      </Button>
    </Popover>
  );
};

ClusterUpdateLink.propTypes = {
  cluster: PropTypes.object.isRequired,
  openModal: PropTypes.func,
  hideOSDUpdates: PropTypes.bool,
};

export default ClusterUpdateLink;
