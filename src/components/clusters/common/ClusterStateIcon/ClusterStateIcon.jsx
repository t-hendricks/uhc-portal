// ClusterStateIcon matches a cluster state from the API to the matching icon

import React from 'react';
import PropTypes from 'prop-types';
import {
  HourglassHalfIcon,
  InProgressIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  BanIcon,
  ExclamationTriangleIcon,
  UnlinkIcon,
  UnknownIcon,
} from '@patternfly/react-icons';
// need to disable eslint for the react tokens because it's silly - it warns about these names
// eslint-disable-next-line camelcase
import { global_warning_color_100, global_danger_color_100, global_success_color_100 } from '@patternfly/react-tokens';
import clusterStates from '../clusterStates';

function ClusterStateIcon(props) {
  const { clusterState } = props;

  const iconProps = {
    className: 'clusterstate',
    size: 'sm',
  };
  const staleIconProps = {
    ...iconProps,
    className: `stale ${iconProps.className}`,
  };
  const longStaleIconProps = {
    ...iconProps,
    className: `long-stale ${iconProps.className}`,
  };

  // Icons from http://openshift.github.io/openshift-origin-design/web-console/4.0-designs/status/status
  switch (clusterState) {
    case clusterStates.PENDING:
    case clusterStates.PATCHING:
      return <HourglassHalfIcon {...iconProps} />;
    case clusterStates.INSTALLING:
      return <InProgressIcon {...iconProps} />;
    case clusterStates.ERROR:
      return <ExclamationCircleIcon color={global_danger_color_100.value} {...iconProps} />;
    case clusterStates.READY:
      return <CheckCircleIcon color={global_success_color_100.value} {...iconProps} />;
    case clusterStates.UNINSTALLING:
      return <BanIcon color={global_danger_color_100.value} {...iconProps} />;
    case clusterStates.WARNING:
      return <ExclamationTriangleIcon color={global_warning_color_100.value} {...iconProps} />;
    case clusterStates.STALE:
      return <UnlinkIcon {...staleIconProps} />;
    case clusterStates.LONG_STALE:
      return <UnlinkIcon {...longStaleIconProps} />;
    default:
      return <UnknownIcon {...iconProps} />;
  }
}

ClusterStateIcon.propTypes = {
  clusterState: PropTypes.string.isRequired,
};

export default ClusterStateIcon;
