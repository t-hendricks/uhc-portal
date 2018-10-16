import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'patternfly-react';

function ClusterStateIcon(props) {
  const { clusterState } = props;

  let icon;
  switch (clusterState) {
    case 'installing':
    case 'pending':
      icon = 'in-progress';
      break;
    case 'error':
      icon = 'error-circle-o';
      break;
    case 'ready':
      icon = 'ok';
      break;
    default:
      icon = 'unknown';
  }
  return (
    <Icon name={icon} type="pf" />);
}

ClusterStateIcon.propTypes = {
  clusterState: PropTypes.string.isRequired,
};

export default ClusterStateIcon;
