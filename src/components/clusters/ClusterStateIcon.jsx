// ClusterStateIcon matches a cluster state from the API to the matching icon

import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'patternfly-react';

function ClusterStateIcon(props) {
  const { clusterState } = props;

  let icon = { type: 'pf' };
  // Icons from http://openshift.github.io/openshift-origin-design/web-console/4.0-designs/status/status
  switch (clusterState) {
    case 'pending':
      icon = { type: 'fa', name: 'hourglass-half' };
      break;
    case 'installing':
      icon.name = 'in-progress';
      break;
    case 'error':
      icon.name = 'error-circle-o';
      break;
    case 'ready':
      icon.name = 'ok';
      break;
    case 'uninstalling':
      icon = { type: 'fa', name: 'ban' };
      break;
    case 'patching':
      icon = { type: 'fa', name: 'hourglass-half' };
      break;
    default:
      icon.name = 'unknown';
  }
  // patternfly bug workaround: pf icons ignore the `size` prop.
  // Specifying className='fa-lg' makes them larger too.
  return (
    <Icon className="fa-lg" {...icon} />);
}

ClusterStateIcon.propTypes = {
  clusterState: PropTypes.string.isRequired,
};

export default ClusterStateIcon;
