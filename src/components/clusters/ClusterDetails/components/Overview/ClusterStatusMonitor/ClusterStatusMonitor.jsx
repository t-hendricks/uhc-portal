import React from 'react';
import PropTypes from 'prop-types';

import {
  Alert,
} from '@patternfly/react-core';

import clusterStates from '../../../../common/clusterStates';

class clusterStatusMonitor extends React.Component {
  timerID = null;

  componentDidMount() {
    this.update();
  }

  componentDidUpdate(prevProps) {
    const { status, cluster, refresh } = this.props;
    if (prevProps.status.pending && !status.pending) {
      if (this.timerID !== null) {
        clearTimeout(this.timerID);
      }

      const isInstalling = state => state === clusterStates.INSTALLING
                                 || state === clusterStates.PENDING;

      if (status.fulfilled) {
        const clusterState = status.status.state;
        if (clusterState !== cluster.state) {
          refresh(); // state transition -> refresh main view
        }
        if (isInstalling(clusterState)) {
          this.timerID = setTimeout(this.update, 5000); // still installing, check again in 5s
        }
      } else if (status.error && isInstalling(cluster.state)) {
        // if we failed to get the /status endpoint
        // all we can do is look at the state in cluster object and hope for the best
        this.timerID = setTimeout(this.update, 5000);
      }
    }
  }

  componentWillUnmount() {
    if (this.timerID !== null) {
      clearTimeout(this.timerID);
    }
  }

  update = () => {
    const { cluster, getClusterStatus } = this.props;
    getClusterStatus(cluster.id);
    this.timerID = null;
  }

  render() {
    const { status, cluster } = this.props;
    if (status.status.id === cluster.id
        && status.status.state === clusterStates.ERROR) {
      return (
        <Alert variant="danger" isInline title="Cluster installation failed">
          {status.status.description}
        </Alert>
      );
    }
    return null;
  }
}

clusterStatusMonitor.propTypes = {
  cluster: PropTypes.shape({
    id: PropTypes.string,
    state: PropTypes.string,
  }),
  refresh: PropTypes.func,
  getClusterStatus: PropTypes.func,
  status: PropTypes.shape({
    pending: PropTypes.bool,
    fulfilled: PropTypes.bool,
    error: PropTypes.bool,
    errorCode: PropTypes.string,
    status: PropTypes.shape({
      id: PropTypes.string,
      description: PropTypes.string,
      state: PropTypes.string,
    }),
  }),
};

export default clusterStatusMonitor;
