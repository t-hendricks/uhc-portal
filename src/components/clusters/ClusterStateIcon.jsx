import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
} from 'patternfly-react';

function ClusterStateIcon(props) {
  const {
    clusterState
  } = props;

  let icon;
  switch (clusterState) {
    case 'Installing':
      icon = 'maintenance';
      break;
    case 'Error':
      icon = 'error-circle-o';
      break;
    case 'OK':
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