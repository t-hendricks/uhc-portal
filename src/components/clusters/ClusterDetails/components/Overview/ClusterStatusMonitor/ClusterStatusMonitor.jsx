import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import PlusCircleIcon from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import MinusCircleIcon from '@patternfly/react-icons/dist/esm/icons/minus-circle-icon';
import { Alert, Flex, FlexItem, Button } from '@patternfly/react-core';
import { TableVariant, TableComposable, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';

import { InflightCheckState } from '~/types/clusters_mgmt.v1';
import clusterStates from '../../../../common/clusterStates';
import getClusterName from '../../../../../../common/getClusterName';
import ExternalLink from '../../../../../common/ExternalLink';

class clusterStatusMonitor extends React.Component {
  timerID = null;

  state = {
    isExpanded: false,
  };

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

  toggleExpanded = (isExpanded) => {
    this.setState({ isExpanded });
  };

  render() {
    const { status, inflightChecks, cluster } = this.props;
    const { isExpanded } = this.state;
    if (inflightChecks.fulfilled) {
      this.inflightChecksRef.current = inflightChecks.checks;
    }

    if (status.status.id === cluster.id) {
      const inflightErrorStopInstall = status.status.provision_error_code === 'OCM4001';
      const getInflightAlert = () => {
        const inflightError = this.inflightChecksRef.current.find(
          (check) => check.state === InflightCheckState.FAILED,
        );

        if (inflightError) {
          let documentLink;
          let subnets = [];
          let inflightTable;
          if (inflightError) {
            reason =
              "To allow this cluster to be fully-managed, add these url's to the allowlist of these subnet firewalls. For more information review the egress requirements or contact Red Hat support.";
            const { details } = inflightError;
            Object.keys(details).forEach((dkey) => {
              if (dkey === 'documentation_link') {
                documentLink = details[dkey];
              } else if (dkey.startsWith('subnet')) {
                const egressErrors = [];
                subnets.push({ name: dkey, egressErrors });
                Object.keys(details[dkey]).forEach((skey) => {
                  if (skey.startsWith('egress_url_errors')) {
                    egressErrors.push(details[dkey][skey].split(' ').pop());
                  }
                });
              }
            });
            if (subnets.length) {
              const hasMore = subnets.length > 1;
              if (hasMore && !isExpanded) subnets = subnets.slice(0, 1);
              const columns = [{ title: 'Subnet' }, { title: 'URLs' }];
              const subnetRow = ({ name, egressErrors }) => (
                <Tbody>
                  <Tr>
                    <Td />
                    <Td modifier="nowrap">{name}</Td>
                    <Td style={{ whiteSpace: 'break-spaces' }}>{egressErrors.join(',   ')}</Td>
                  </Tr>
                </Tbody>
              );
              inflightTable = (
                <>
                  <TableComposable
                    aria-label="Missing allowlist URLs"
                    variant={TableVariant.compact}
                    style={{ backgroundColor: 'unset' }}
                  >
                    <Thead>
                      <Tr>
                        <Th />
                        {columns.map((column) => (
                          <Th>{column.title}</Th>
                        ))}
                      </Tr>
                    </Thead>
                    {subnets.map((subnet) => subnetRow(subnet))}
                  </TableComposable>
                  {hasMore && (
                    <Button
                      variant="link"
                      icon={isExpanded ? <MinusCircleIcon /> : <PlusCircleIcon />}
                      onClick={() => this.toggleExpanded(!isExpanded)}
                    >
                      {isExpanded ? 'Show less' : 'Show more'}
                    </Button>
                  )}
                </>
              );
            }
          }
          return (
            <Alert
              variant={inflightErrorStopInstall ? 'danger' : 'warning'}
              isInline
              title="Network settings validation failed"
            >
              <Flex direction={{ default: 'column' }}>
                <FlexItem>{`${reason}`}</FlexItem>
                {inflightTable && <FlexItem>{inflightTable}</FlexItem>}
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
                      <ExternalLink
                        noIcon
                        href="https://access.redhat.com/support/cases/#/case/new"
                      >
                        Contact support
                      </ExternalLink>
                    </FlexItem>
                  </Flex>
                </FlexItem>
              </Flex>
            </Alert>
          );
        }

        return null;
      };

      const title = status.status.provision_error_code || '';
      let reason = '';
      if (status.status.provision_error_code) {
        reason = get(status, 'status.provision_error_message', '');
      }
      const description = get(status, 'status.description', '');
      return (
        <>
          {status.status.state === clusterStates.ERROR && !inflightErrorStopInstall && (
            <Alert variant="danger" isInline title={`${title} Cluster installation failed`}>
              {`${reason} ${description}`}
            </Alert>
          )}{' '}
          {getInflightAlert()}{' '}
          {status.status.state !== clusterStates.ERROR &&
            (status.status.provision_error_code || status.status.provision_error_message) && (
              <Alert
                variant="warning"
                isInline
                title={`${title} Installation is taking longer than expected`}
              >
                {reason}
              </Alert>
            )}
        </>
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
