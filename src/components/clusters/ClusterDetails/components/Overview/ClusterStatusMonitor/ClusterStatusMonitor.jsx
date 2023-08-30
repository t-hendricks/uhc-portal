import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import { Alert, Flex, FlexItem } from '@patternfly/react-core';

import { InflightCheckState } from '~/types/clusters_mgmt.v1';
import clusterStates from '../../../../common/clusterStates';
import getClusterName from '../../../../../../common/getClusterName';
import ExternalLink from '../../../../../common/ExternalLink';

class clusterStatusMonitor extends React.Component {
  timerID = null;

  constructor(props) {
    super(props);
    this.inflightChecksRef = React.createRef();
    this.inflightChecksRef.current = [];
  }

  componentDidMount() {
    this.update();
  }

  componentDidUpdate(prevProps) {
    const { status, inflightChecks, cluster, refresh, addNotification, history } = this.props;
    if (
      (prevProps.status.pending && !status.pending) ||
      (prevProps.inflightChecks.pending && !inflightChecks.pending)
    ) {
      if (this.timerID !== null) {
        clearTimeout(this.timerID);
      }

      // final state is READY
      const isInstalling = (state) =>
        state === clusterStates.INSTALLING ||
        state === clusterStates.PENDING ||
        state === clusterStates.VALIDATING ||
        state === clusterStates.WAITING;

      // if not running any checks final state is success
      const isChecking = (state) =>
        state !== clusterStates.ERROR &&
        inflightChecks.checks.some((check) => check.state === InflightCheckState.RUNNING);

      // inflight checks are asynchronous with installing because they can take awhile
      if (status.fulfilled && inflightChecks.fulfilled) {
        const clusterState = status.status.state;
        // refresh main detail page if cluster state changed or if still running inflight checks
        if (clusterState !== cluster.state || isChecking(clusterState)) {
          // (also updates the ProgressList)
          refresh(); // state transition -> refresh main view
        }

        // if still installing/uninstalling or running inflight checks, check again in 5s
        if (
          isInstalling(clusterState) ||
          clusterState === clusterStates.UNINSTALLING ||
          isChecking(clusterState)
        ) {
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
    // inflight checks are asynchronous with installing because they can take awhile
    const { cluster, getClusterStatus, getInflightChecks } = this.props;
    getClusterStatus(cluster.id);
    getInflightChecks(cluster.id);
    this.timerID = null;
  };

  render() {
    const { status, inflightChecks, cluster } = this.props;
    if (inflightChecks.fulfilled) {
      this.inflightChecksRef.current = inflightChecks.checks;
    }

    const title = status.status.provision_error_code || '';

    let reason = '';
    if (status.status.provision_error_code) {
      reason = get(status, 'status.provision_error_message', '');
    }

    if (status.status.id === cluster.id) {
      const inflightError = this.inflightChecksRef.current.find(
        (check) => check.state === InflightCheckState.FAILED,
      );
      if (status.status.state === clusterStates.ERROR || inflightError) {
        let documentLink;
        if (inflightError) {
          reason =
            'Could not create the cluster because the network validation failed. To create a new cluster, review the requirements or contact Red Hat support.';
          documentLink = get(inflightError, 'details.documentation_link');
        }
        return (
          <Alert variant="danger" isInline title="Cluster creation failed">
            <Flex direction={{ default: 'column' }}>
              <FlexItem>{`${title} ${reason}`}</FlexItem>
              <FlexItem>
                <Flex direction={{ default: 'row' }}>
                  {documentLink && (
                    <FlexItem>
                      <ExternalLink noIcon href={documentLink}>
                        Review egress requirements
                      </ExternalLink>
                    </FlexItem>
                  )}
                  <FlexItem>
                    <ExternalLink noIcon href="https://access.redhat.com/support/cases/#/case/new">
                      Contact support
                    </ExternalLink>
                  </FlexItem>
                </Flex>
              </FlexItem>
            </Flex>
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
  getInflightChecks: PropTypes.func,
  inflightChecks: PropTypes.shape({
    pending: PropTypes.bool,
    fulfilled: PropTypes.bool,
    error: PropTypes.bool,
    checks: PropTypes.array,
  }),
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
