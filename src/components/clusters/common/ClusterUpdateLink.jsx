import React from 'react';
import PropTypes from 'prop-types';
import { Button, Popover } from '@patternfly/react-core';
import { InfoCircleIcon, OutlinedArrowAltCircleUpIcon } from '@patternfly/react-icons';
import links from '../../../common/installLinks';


const ClusterUpdateLink = ({ cluster }) => {
  const { upgrade } = cluster.metrics;

  // Show which version the cluster is currently updating to
  if (upgrade.state === 'running' && upgrade.version && (cluster.openshift_version !== upgrade.version)) {
    return (
      <span>
        {' '}
        &rarr;
        {` ${upgrade.version}`}
      </span>
    );
  }

  // Only show Update tooltip/link for OCP clusters that have available updates
  if (cluster.managed || !upgrade.available) {
    return null;
  }

  // Display a link to the cluster settings page in the console
  if (cluster.console && cluster.console.url) {
    return (
      <a href={`${cluster.console.url}/settings/cluster`} target="_blank" rel="noopener noreferrer">
        <Button className="cluster-update-link" variant="link" icon={<OutlinedArrowAltCircleUpIcon />}>
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
      bodyContent={(
        <div>
          An update is available for this cluster.
          Navigate to the Cluster settings page in the cluster&apos;s web console to update.
          {' '}
          <a href={links.UPDATING_CLUSTER} target="_blank" rel="noreferrer noopener">
            Learn more
          </a>
        </div>
      )}
    >
      <Button className="cluster-update-link" variant="link" icon={<InfoCircleIcon />}>
        Update
      </Button>
    </Popover>
  );
};

ClusterUpdateLink.propTypes = {
  cluster: PropTypes.object.isRequired,
};

export default ClusterUpdateLink;
