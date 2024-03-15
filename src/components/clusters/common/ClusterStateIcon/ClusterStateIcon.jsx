// ClusterStateIcon matches a cluster state from the API to the matching icon

import React from 'react';
import PropTypes from 'prop-types';
import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { DisconnectedIcon } from '@patternfly/react-icons/dist/esm/icons/disconnected-icon';
import { UnknownIcon } from '@patternfly/react-icons/dist/esm/icons/unknown-icon';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { InProgressIcon } from '@patternfly/react-icons/dist/esm/icons/in-progress-icon';
import { BanIcon } from '@patternfly/react-icons/dist/esm/icons/ban-icon';
import { FolderOpenIcon } from '@patternfly/react-icons/dist/esm/icons/folder-open-icon';
import { AsleepIcon } from '@patternfly/react-icons/dist/esm/icons/asleep-icon';
import { NotStartedIcon } from '@patternfly/react-icons/dist/esm/icons/not-started-icon';

import { global_danger_color_100 as dangerColor } from '@patternfly/react-tokens/dist/esm/global_danger_color_100';
import { global_success_color_100 as successColor } from '@patternfly/react-tokens/dist/esm/global_success_color_100';
import { Spinner, spinnerSize, Icon } from '@patternfly/react-core';
import clusterStates from '../clusterStates';

function ClusterStateIcon(props) {
  const { clusterState, animated, limitedSupport } = props;

  const iconProps = {
    className: 'clusterstate',
    size: 'md',
  };

  if (limitedSupport && clusterState !== clusterStates.ERROR) {
    return (
      <Icon {...iconProps}>
        <ExclamationCircleIcon color={dangerColor.value} />
      </Icon>
    );
  }

  switch (clusterState) {
    case clusterStates.WAITING:
    case clusterStates.PENDING:
    case clusterStates.INSTALLING:
    case clusterStates.VALIDATING:
    case clusterStates.UPDATING:
    case clusterStates.POWERING_DOWN:
    case clusterStates.RESUMING:
      if (animated) {
        return <Spinner {...iconProps} size={spinnerSize.md} />;
      }
      return (
        <Icon {...iconProps}>
          <InProgressIcon data-icon-type="inprogress" />
        </Icon>
      );
    case clusterStates.DISCONNECTED:
      return (
        <Icon {...iconProps}>
          <DisconnectedIcon />
        </Icon>
      );
    case clusterStates.READY:
      return (
        <Icon {...iconProps}>
          <CheckCircleIcon color={successColor.value} data-icon-type="check" />
        </Icon>
      );
    case clusterStates.UNINSTALLING:
      if (animated) {
        return <Spinner {...iconProps} size={spinnerSize.md} />;
      }
      return (
        <Icon {...iconProps}>
          <InProgressIcon data-icon-type="inprogress" />
        </Icon>
      );
    case clusterStates.ERROR:
      return (
        <Icon {...iconProps}>
          <ExclamationCircleIcon color={dangerColor.value} data-icon-type="exclamation" />
        </Icon>
      );
    case clusterStates.DEPROVISIONED:
      return (
        <Icon {...iconProps}>
          <BanIcon />
        </Icon>
      );
    case clusterStates.ARCHIVED:
      return (
        <Icon {...iconProps}>
          <FolderOpenIcon />
        </Icon>
      );
    case clusterStates.HIBERNATING:
      return (
        <Icon {...iconProps}>
          <AsleepIcon />
        </Icon>
      );
    case clusterStates.STALE:
      return (
        <Icon {...iconProps}>
          <NotStartedIcon />
        </Icon>
      );
    default:
      return (
        <Icon {...iconProps}>
          <UnknownIcon data-icon-type="unknown" />
        </Icon>
      );
  }
}

ClusterStateIcon.propTypes = {
  clusterState: PropTypes.string,
  limitedSupport: PropTypes.bool,
  animated: PropTypes.bool,
};
ClusterStateIcon.defaultProps = {
  animated: false,
};
export default ClusterStateIcon;
