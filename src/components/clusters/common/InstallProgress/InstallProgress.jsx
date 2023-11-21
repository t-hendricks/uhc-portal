import React from 'react';
import PropTypes from 'prop-types';
import { InflightCheckState } from '~/types/clusters_mgmt.v1';

import clusterStates, { getInflightChecks } from '../clusterStates';
import ProgressList from './ProgressList';

const InstallProgress = ({ cluster, hasNetworkOndemand }) => {
  const isAnyCheckNotPassedState = getInflightChecks(cluster).some(
    (check) => check.state !== InflightCheckState.PASSED,
  );
  return isAnyCheckNotPassedState ||
    cluster.state === clusterStates.INSTALLING ||
    cluster.state === clusterStates.PENDING ||
    cluster.state === clusterStates.VALIDATING ||
    cluster.state === clusterStates.WAITING ? (
    <ProgressList
      cluster={cluster}
      hasNetworkOndemand={hasNetworkOndemand}
      actionRequiredInitialOpen
    />
  ) : null;
};

InstallProgress.propTypes = {
  cluster: PropTypes.object.isRequired,
  hasNetworkOndemand: PropTypes.bool.isRequired,
};

export default InstallProgress;
