import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import PlusCircleIcon from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import MinusCircleIcon from '@patternfly/react-icons/dist/esm/icons/minus-circle-icon';
import { Alert, Flex, FlexItem, Button, ButtonVariant, Spinner } from '@patternfly/react-core';
import { TableVariant, TableComposable, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { HAD_INFLIGHT_ERROR_LOCALSTORAGE_KEY } from '~/common/localStorageConstants';

import { InflightCheckState } from '~/types/clusters_mgmt.v1';
import clusterStates, {
  isOSDGCPWaitingForRolesOnHostProject,
} from '../../../../common/clusterStates';
import getClusterName from '../../../../../../common/getClusterName';
import ExternalLink from '../../../../../common/ExternalLink';
import ErrorModal from '../../../../../common/ErrorModal';

class clusterStatusMonitor extends React.Component {
  timerID = null;

  state = {
    isExpanded: false,
    isErrorOpen: false,
    wasRunClicked: false,
    isValidatorRunning: false,
  };

  componentDidMount() {
    const { resetInflightChecks } = this.props;
    resetInflightChecks();
    this.update();
  }

  componentDidUpdate(prevProps) {
    const {
      status,
      inflightChecks,
      rerunInflightCheckReq,
      rerunInflightCheckRes,
      cluster,
      refresh,
      addNotification,
      history,
    } = this.props;
    if (
      (prevProps.status.pending && !status.pending) ||
      (prevProps.inflightChecks.pending && !inflightChecks.pending)
    ) {
      if (this.timerID !== null) {
        clearTimeout(this.timerID);
      }

      // final state is READY
      const isClusterInstalling = (state) =>
        state === clusterStates.INSTALLING ||
        state === clusterStates.PENDING ||
        state === clusterStates.VALIDATING ||
        state === clusterStates.WAITING;

      // if not running any checks final state is success
      const shouldUpdateInflightChecks = () =>
        inflightChecks.checks.some(
          (check) =>
            check.state === InflightCheckState.RUNNING || check.state === InflightCheckState.FAILED,
        );

      // inflight checks are asynchronous with installing because they can take awhile
      if (status.fulfilled && inflightChecks.fulfilled) {
        const clusterState = status.status.state;
        // refresh main detail page if cluster state changed or if still running inflight checks
        if (clusterState !== cluster.state || shouldUpdateInflightChecks()) {
          // (also updates the ProgressList)
          refresh(); // state transition -> refresh main view
        }

        // if still installing/uninstalling or running inflight checks, check again in 5s
        if (
          isClusterInstalling(clusterState) ||
          clusterState === clusterStates.UNINSTALLING ||
          shouldUpdateInflightChecks()
        ) {
          this.timerID = setTimeout(this.update, 5000);
        }
      } else if (status.error) {
        if (isClusterInstalling(cluster.state)) {
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
    if (prevProps.rerunInflightCheckReq.pending && !rerunInflightCheckReq.pending) {
      // rerun button was clicked but error occurred trying  to start the validator
      if (rerunInflightCheckReq.error) {
        this.setState({ isErrorOpen: true, wasRunClicked: false });
      }
      // we use wasRunClicked state to make sure the spinner next to the rerun button keeps spinning
      // until the validator starts running and we can use that to see if the validator is still
      // running. once clicked, it might take a bit for the validator starts up-- so rather then
      // have the spinner disappear we give it 10 seconds to start up
      if (rerunInflightCheckReq.fulfilled) {
        setTimeout(() => {
          this.setState({ wasRunClicked: false });
        }, 10000);
      }
    }
    // user might navigate away from this page so the button click state might be lost
    // so we use this to determine if the validator is running irregardless of when/where the button was clicked
    if (prevProps.rerunInflightCheckRes.pending && !rerunInflightCheckRes.pending) {
      if (rerunInflightCheckRes.fulfilled) {
        const isValidatorRunning = rerunInflightCheckRes.checks.some(
          (check) =>
            check.state === InflightCheckState.RUNNING ||
            check.state === InflightCheckState.PENDING,
        );
        this.setState({ isValidatorRunning });
      }
    }
  }

  componentWillUnmount() {
    if (this.timerID !== null) {
      clearTimeout(this.timerID);
    }
  }

  update = () => {
    const { cluster, getClusterStatus, getInflightChecks, getRerunInflightChecks } = this.props;
    getClusterStatus(cluster.id);
    getInflightChecks(cluster.id);
    if (cluster?.aws?.subnet_ids) {
      getRerunInflightChecks(cluster.aws.subnet_ids);
    }
    this.timerID = null;
  };

  toggleExpanded = (isExpanded) => {
    this.setState({ isExpanded });
  };

  render() {
    const { status, cluster } = this.props;

    if (status.status.id === cluster.id) {
      const inflightErrorStopInstall = status.status.provision_error_code === 'OCM4001';
      const errorCode = status.status.provision_error_code || '';
      let reason = '';
      if (status.status.provision_error_code) {
        reason = get(status, 'status.provision_error_message', '');
      }
      const description = get(status, 'status.description', '');

      const alerts = [];

      // Cluster install failure
      if (status.status.state === clusterStates.ERROR && !inflightErrorStopInstall) {
        alerts.push(
          <Alert variant="danger" isInline title={`${errorCode} Cluster installation failed`}>
            {`This cluster cannot be recovered, however you can use the logs and network validation to diagnose the problem: ${reason} ${description}`}
          </Alert>,
        );
      }

      // Rosa inflight error check found urls missing from byo vpc firewall
      alerts.push(this.showMissingURLList(inflightErrorStopInstall));

      // OSD GCP is waiting on roles to be added to dynamically generated service account for a shared vpc project
      alerts.push(this.showRequiredGCPRoles());

      // Cluster is taking a lot of time to create
      if (
        status.status.state !== clusterStates.ERROR &&
        (status.status.provision_error_code || status.status.provision_error_message)
      ) {
        alerts.push(
          <Alert
            variant="warning"
            isInline
            title={`${errorCode} Installation is taking longer than expected`}
          >
            {reason}
          </Alert>,
        );
      }
      return <>{alerts.filter((n) => n)}</>;
    }
    return null;
  }

  showRequiredGCPRoles() {
    const { cluster } = this.props;
    if (isOSDGCPWaitingForRolesOnHostProject(cluster)) {
      const hostProjectId = cluster?.gcp_network?.vpc_project_id;
      const dynamicServiceAccount =
        cluster?.status?.description?.split(' ').filter((seg) => seg.endsWith('.com'))?.[0] ||
        'unknown';
      const reason = [];
      reason.push('To continue cluster installation, contact the VPC owner of the ');
      reason.push(<b>{hostProjectId}</b>);
      reason.push(' host project, who must grant the ');
      reason.push(<b>{dynamicServiceAccount}</b>);
      reason.push(' service account the following roles: ');
      reason.push(<b>Compute Network Administrator, </b>);
      reason.push(<b>Compute Security Administrator, </b>);
      reason.push(<b>DNS Administrator.</b>);
      return (
        <Alert variant="warning" isInline title="Permissions needed:">
          <Flex direction={{ default: 'column' }}>
            <FlexItem>{reason}</FlexItem>
            <FlexItem>
              <ExternalLink href="https://cloud.google.com/vpc/docs/provisioning-shared-vpc#migs-service-accounts">
                Learn more about permissions
              </ExternalLink>
            </FlexItem>
          </Flex>
        </Alert>
      );
    }
    return null;
  }

  showMissingURLList(inflightErrorStopInstall) {
    const { inflightChecks, rerunInflightChecks, rerunInflightCheckReq, cluster } = this.props;
    const { isExpanded, isErrorOpen, wasRunClicked, isValidatorRunning } = this.state;
    const inflightError = inflightChecks.checks.find(
      (check) => check.state === InflightCheckState.FAILED,
    );
    if (inflightError) {
      let documentLink;
      let subnets = [];
      let inflightTable;
      let rerunValidator;
      const hadInflightErrorKey = `${HAD_INFLIGHT_ERROR_LOCALSTORAGE_KEY}_${cluster.id}`;
      localStorage.setItem(hadInflightErrorKey, !!inflightError);
      const reason =
        'To allow this cluster to be fully-managed, add these URLs to the allowlist of these subnet firewalls. For more information review the egress requirements or contact Red Hat support.';
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
          egressErrors.sort((a, b) => {
            const aArr = a.split(':');
            const bArr = b.split(':');
            const ret = aArr[1].localeCompare(bArr[1]);
            return ret === 0 ? aArr[0].localeCompare(bArr[0]) : ret;
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
                    <Th key={column.title}>{column.title}</Th>
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
        rerunValidator = () => {
          this.setState({ wasRunClicked: true });
          rerunInflightChecks(cluster.id);
        };
      }
      // show spinner on rerun button
      const runningInflightCheck = wasRunClicked || isValidatorRunning;
      return (
        <Alert
          variant={inflightErrorStopInstall ? 'danger' : 'warning'}
          isInline
          title="User action required"
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
                  <ExternalLink noIcon href="https://access.redhat.com/support/cases/#/case/new">
                    Contact support
                  </ExternalLink>
                </FlexItem>
                <FlexItem>
                  {runningInflightCheck && (
                    <span className="pf-u-mr-sm">
                      <Spinner size="sm" />
                    </span>
                  )}
                  <Button
                    variant={ButtonVariant.link}
                    isInline
                    isDisabled={runningInflightCheck}
                    onClick={rerunValidator}
                  >
                    Rerun network validation
                  </Button>
                  {isErrorOpen && (
                    <ErrorModal
                      title="Error Rerunning Validator "
                      errorResponse={rerunInflightCheckReq}
                      resetResponse={() => this.setState({ isErrorOpen: false })}
                    />
                  )}
                </FlexItem>
              </Flex>
            </FlexItem>
          </Flex>
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
    status: PropTypes.shape({
      description: PropTypes.string,
    }),
    aws: PropTypes.shape({
      subnet_ids: PropTypes.array,
    }),
    gcp_network: PropTypes.shape({
      vpc_project_id: PropTypes.string,
    }),
  }),
  refresh: PropTypes.func,
  addNotification: PropTypes.func,
  getClusterStatus: PropTypes.func,
  getInflightChecks: PropTypes.func,
  rerunInflightChecks: PropTypes.func,
  getRerunInflightChecks: PropTypes.func,
  resetInflightChecks: PropTypes.func,
  inflightChecks: PropTypes.shape({
    pending: PropTypes.bool,
    fulfilled: PropTypes.bool,
    error: PropTypes.bool,
    checks: PropTypes.array,
  }),
  rerunInflightCheckReq: PropTypes.shape({
    pending: PropTypes.bool,
    fulfilled: PropTypes.bool,
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
    operationID: PropTypes.string,
  }),
  rerunInflightCheckRes: PropTypes.shape({
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
