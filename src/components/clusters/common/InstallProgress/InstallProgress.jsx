import React from 'react';
import PropTypes from 'prop-types';
import { InflightCheckState } from '~/types/clusters_mgmt.v1';

import clusterStates from '../clusterStates';
import ProgressList from './ProgressList';

function InstallProgress({ cluster, inflightChecks }) {
  const showInflightProgress =
    inflightChecks.pending ||
    (inflightChecks.fulfilled &&
      inflightChecks.checks.some((check) => check.state !== InflightCheckState.PASSED));
  return showInflightProgress ||
    cluster.state === clusterStates.INSTALLING ||
    cluster.state === clusterStates.PENDING ||
    cluster.state === clusterStates.VALIDATING ||
    cluster.state === clusterStates.WAITING ? (
    <ProgressList cluster={cluster} inflightChecks={inflightChecks} actionRequiredInitialOpen />
  ) : null;
}

InstallProgress.propTypes = {
  cluster: PropTypes.object.isRequired,
  inflightChecks: PropTypes.shape({
    pending: PropTypes.bool,
    fulfilled: PropTypes.bool,
    error: PropTypes.bool,
    checks: PropTypes.array,
  }),
};

export default InstallProgress;
