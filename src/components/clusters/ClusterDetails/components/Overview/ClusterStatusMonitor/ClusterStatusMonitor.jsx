import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import { Alert } from '@patternfly/react-core';

import clusterStates from '../../../../common/clusterStates';
import getClusterName from '../../../../../../common/getClusterName';

class clusterStatusMonitor extends React.Component {
  timerID = null;

  componentDidMount() {
    this.update();
  }

  componentDidUpdate(prevProps) {
    const { status, cluster, refresh, addNotification, history } = this.props;
    if (prevProps.status.pending && !status.pending) {
      if (this.timerID !== null) {
        clearTimeout(this.timerID);
      }

      const isInstalling = (state) =>
        state === clusterStates.INSTALLING ||
        state === clusterStates.PENDING ||
        state === clusterStates.WAITING;

      if (status.fulfilled) {
        const clusterState = status.status.state;
        if (clusterState !== cluster.state) {
          refresh(); // state transition -> refresh main view
        }
        if (isInstalling(clusterState) || clusterState === clusterStates.UNINSTALLING) {
          // still installing/uninstalling, check again in 5s
          this.timerID = setTimeout(this.update, 5000);
        }
      } else if (status.error) {
        if (isInstalling(cluster.state)) {
          // if we failed to get the /status endpoint (and we weren't uninstalling)
          // all we can do is look at the state in cluster object and hope for the best
          this.timerID = setTimeout(this.update, 5000);
        } else if (cluster.state === clusterStates.UNINSTALLING && status.errorCode === 404) {
          addNotification({
            title: `Successfully uninstalled cluster ${getClusterName(cluster)}`,
            variant: 'success',
          });
          history.push('/');
        }
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
  };

  render() {
    const { status, cluster } = this.props;
    const title = status.status.provision_error_code || '';

    let reason = '';
    if (status.status.provision_error_code) {
      reason = get(status, 'status.provision_error_message', '');
    }

    if (status.status.id === cluster.id) {
      if (status.status.state === clusterStates.ERROR) {
        return (
          <Alert variant="danger" isInline title={`${title} Cluster installation failed`}>
            {reason}
          </Alert>
        );
      }
      if (status.status.provision_error_code || status.status.provision_error_message) {
        return (
          <span>
            <Alert
              variant="warning"
              isInline
              title={`${title} Installation is taking longer than expected`}
            >
              {reason}
            </Alert>
            <br />
          </span>
        );
      }
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
  addNotification: PropTypes.func,
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
      provision_error_code: PropTypes.string,
      provision_error_message: PropTypes.string,
    }),
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default clusterStatusMonitor;
