// ClusterStateIcon matches a cluster state from the API to the matching icon

import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'patternfly-react';
import clusterStates from '../clusterStates';

function ClusterStateIcon(props) {
  const { clusterState } = props;

  let icon = { type: 'pf' };
  // Icons from http://openshift.github.io/openshift-origin-design/web-console/4.0-designs/status/status
  switch (clusterState) {
    case clusterStates.PENDING:
      icon = { type: 'fa', name: 'hourglass-half' };
      break;
    case clusterStates.INSTALLING:
      icon.name = 'in-progress';
      break;
    case clusterStates.ERROR:
      icon.name = 'error-circle-o';
      break;
    case clusterStates.READY:
      icon.name = 'ok';
      break;
    case clusterStates.UNINSTALLING:
      icon = { type: 'fa', name: 'ban' };
      break;
    case clusterStates.PATCHING:
      icon = { type: 'fa', name: 'hourglass-half' };
      break;
    case clusterStates.WARNING:
      icon.name = 'warning-triangle-o';
      break;
    case clusterStates.STALE:
      icon.name = 'disconnected';
      break;
    case clusterStates.ARCHIVED:
      icon = { type: 'fa', name: 'chain-broken' };
      break;
    default:
      icon.name = 'unknown';
  }
  // patternfly bug workaround: pf icons ignore the `size` prop.
  // Specifying className='fa-lg' makes them larger too.
  return (
    <Icon className="fa-lg clusterstate" {...icon} />);
}

ClusterStateIcon.propTypes = {
  clusterState: PropTypes.string.isRequired,
};

export default ClusterStateIcon;
