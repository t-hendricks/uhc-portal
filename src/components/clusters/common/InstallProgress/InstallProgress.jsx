import React from 'react';
import PropTypes from 'prop-types';

import clusterStates from '../clusterStates';
import ProgressList from './ProgressList';

function InstallProgress({ cluster }) {
  return (
    (cluster.state === clusterStates.INSTALLING ||
      cluster.state === clusterStates.PENDING ||
      cluster.state === clusterStates.WAITING) && (
      <ProgressList cluster={cluster} actionRequiredInitialOpen />
    )
  );
}

InstallProgress.propTypes = {
  cluster: PropTypes.object.isRequired,
};

export default InstallProgress;
