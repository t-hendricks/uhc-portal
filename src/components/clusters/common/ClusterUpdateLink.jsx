import React from 'react';
import PropTypes from 'prop-types';
import { Button, Popover } from '@patternfly/react-core';
import { InfoCircleIcon, OutlinedArrowAltCircleUpIcon } from '@patternfly/react-icons';

const ClusterUpdateLink = ({ cluster }) => {
  // Only show this for OCP clusters that have available updates
  if (cluster.managed || !cluster.metrics.version_update_available) {
    return null;
  }

  if (cluster.console && cluster.console.url) {
    return (
      <a href={`${cluster.console.url}/settings/cluster`} target="_blank" rel="noreferrer">
        <Button variant="link" icon={<OutlinedArrowAltCircleUpIcon />}>
          Update
        </Button>
      </a>
    );
  }

  return (
    <Popover
      position="top"
      aria-label="Update"
      bodyContent={(
        <div>
          An update is available for this cluster.
          Navigate to the Cluster settings page in the cluster&apos;s web console to update.
          {' '}
          <a href="https://docs.openshift.com/container-platform/latest/updating/updating-cluster.html" target="_blank">
            Learn more
          </a>
        </div>
      )}
    >
      <Button variant="link" icon={<InfoCircleIcon />}>
        Update
      </Button>
    </Popover>
  );
};

ClusterUpdateLink.propTypes = {
  cluster: PropTypes.object.isRequired,
};

export default ClusterUpdateLink;
