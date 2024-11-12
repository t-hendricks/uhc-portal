// Component has to be from lowercase otherwise throws
// can't access lexical declaration '__WEBPACK_DEFAULT_EXPORT__' before initialization
/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import PropTypes from 'prop-types';

import { Alert, Button, ButtonVariant, Flex, FlexItem, Spinner } from '@patternfly/react-core';
import MinusCircleIcon from '@patternfly/react-icons/dist/esm/icons/minus-circle-icon';
import PlusCircleIcon from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import { Table, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import getClusterName from '~/common/getClusterName';
import { HAD_INFLIGHT_ERROR_LOCALSTORAGE_KEY } from '~/common/localStorageConstants';
import { emailRegex } from '~/common/regularExpressions';
import { useNavigate } from '~/common/routing';
import clusterStates, {
  hasInflightEgressErrors,
  isOSDGCPWaitingForRolesOnHostProject,
} from '~/components/clusters/common/clusterStates';
import ClusterStatusErrorDisplay from '~/components/clusters/common/ClusterStatusErrorDisplay';
import ErrorModal from '~/components/common/ErrorModal';
import ExternalLink from '~/components/common/ExternalLink';
import { usePreviousProps } from '~/hooks/usePreviousProps';
import { InflightCheckState } from '~/types/clusters_mgmt.v1';

const ClusterStatusMonitor = (props) => {
  const {
    resetInflightChecks,
    cluster,
    getClusterStatus,
    getInflightChecks,
    getRerunInflightChecks,
    hasNetworkOndemand,
    status,
    inflightChecks,
    rerunInflightChecks,
    rerunInflightCheckReq,
    rerunInflightCheckRes,
    addNotification,
    refresh,
  } = props;

  const navigate = useNavigate();

  const [timerID, setTimerID] = React.useState(null);

  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isErrorOpen, setIsErrorOpen] = React.useState(false);
  const [wasRunClicked, setWasRunClicked] = React.useState(false);
  const [isValidatorRunning, setIsValidatorRunning] = React.useState(false);

  const statusRef = usePreviousProps(status);
  const inflightChecksRef = usePreviousProps(inflightChecks);
  const rerunInflightCheckReqRef = usePreviousProps(rerunInflightCheckReq);
  const rerunInflightCheckResRef = usePreviousProps(rerunInflightCheckRes);

  const update = () => {
    getClusterStatus(cluster.id);
    getInflightChecks(cluster.id);
    if (cluster?.aws?.subnet_ids) {
      getRerunInflightChecks(cluster.aws.subnet_ids);
    }

    setTimerID(null);
  };

  const toggleExpanded = (isExpanded) => {
    setIsExpanded(isExpanded);
  };

  React.useEffect(() => {
    resetInflightChecks();
    update();

    return () => {
      if (timerID !== null) {
        clearTimeout(timerID);
        setTimerID(null);
      }
    };
    // Should run once on mount and once on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (
      (statusRef && statusRef.pending && !status.pending) ||
      (inflightChecksRef && inflightChecksRef.pending && !inflightChecks.pending)
    ) {
      if (timerID !== null) {
        clearTimeout(timerID);
        setTimerID(null);
      }

      // final state is READY
      const isClusterInstalling = (state) =>
        [
          clusterStates.INSTALLING,
          clusterStates.PENDING,
          clusterStates.VALIDATING,
          clusterStates.WAITING,
        ].includes(state);

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
          setTimerID(setTimeout(update, 5000));
          // timerID = setTimeout(update, 5000);
        }
      } else if (status.error) {
        if (isClusterInstalling(cluster.state)) {
          // if we failed to get the /status endpoint (and we weren't uninstalling)
          // all we can do is look at the state in cluster object and hope for the best
          setTimerID(setTimeout(update, 5000));
          // timerID = setTimeout(update, 5000);
        } else if (cluster.state === clusterStates.UNINSTALLING && status.errorCode === 404) {
          addNotification({
            title: `Successfully uninstalled cluster ${getClusterName(cluster)}`,
            variant: 'success',
          });
          navigate('/cluster-list');
        }
      }
    }

    if (
      rerunInflightCheckReqRef &&
      rerunInflightCheckReqRef.pending &&
      !rerunInflightCheckReq.pending
    ) {
      // rerun button was clicked but error occurred trying  to start the validator
      if (rerunInflightCheckReq.error) {
        setIsErrorOpen(true);
        setWasRunClicked(true);
      }
      // we use wasRunClicked state to make sure the spinner next to the rerun button keeps spinning
      // until the validator starts running and we can use that to see if the validator is still
      // running. once clicked, it might take a bit for the validator starts up-- so rather then
      // have the spinner disappear we give it 10 seconds to start up
      if (rerunInflightCheckReq.fulfilled) {
        setTimeout(() => {
          setWasRunClicked(false);
        }, 10000);
      }
    }

    // user might navigate away from this page so the button click state might be lost
    // so we use this to determine if the validator is running irregardless of when/where the button was clicked
    if (
      rerunInflightCheckResRef &&
      rerunInflightCheckResRef.pending &&
      !rerunInflightCheckRes.pending
    ) {
      if (rerunInflightCheckRes.fulfilled) {
        const isValidatorRunning = rerunInflightCheckRes.checks.some(
          (check) =>
            check.state === InflightCheckState.RUNNING ||
            check.state === InflightCheckState.PENDING,
        );
        setIsValidatorRunning(isValidatorRunning);
      }
    }
    // Update should not be in the dependency list
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [
    status,
    inflightChecks,
    rerunInflightCheckReq,
    rerunInflightCheckRes,
    cluster,
    refresh,
    addNotification,
    inflightChecksRef,
    rerunInflightCheckReqRef,
    rerunInflightCheckResRef,
    statusRef,
    timerID,
    navigate,
  ]);

  const showMissingURLList = () => {
    const isClusterValidating =
      cluster.state === clusterStates.VALIDATING || cluster.state === clusterStates.PENDING;
    if (!isClusterValidating) {
      const inflightError = inflightChecks.checks.find(
        (check) => check.state === InflightCheckState.FAILED,
      );
      if (hasInflightEgressErrors(cluster) && inflightError) {
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
              // ex. skey = 'egress_url_errors-0'
              if (skey.startsWith('egress_url_errors')) {
                const urlPattern = /(https?:\/\/[^\s)]+)/;
                // ex. str = 'egressURL error: https://registry.redhat.io:443 (Proxy CONNECT aborted)'
                const str = details[dkey][skey];
                const result = str.match(urlPattern);
                // ex. result = [https://registry.redhat.io:443]
                if (result) {
                  egressErrors.push(result[0]);
                }
              }
            });
            egressErrors.sort((a, b) => {
              const aArr = a.split(':');
              const bArr = b.split(':');
              const ret = aArr[1]?.localeCompare(bArr[1]);
              return ret === 0 ? aArr[0]?.localeCompare(bArr[0]) : ret;
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
              <Table
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
              </Table>
              {hasMore && (
                <Button
                  variant="link"
                  icon={isExpanded ? <MinusCircleIcon /> : <PlusCircleIcon />}
                  onClick={() => toggleExpanded(!isExpanded)}
                >
                  {isExpanded ? 'Show less' : 'Show more'}
                </Button>
              )}
            </>
          );
          rerunValidator = () => {
            setWasRunClicked(true);
            rerunInflightChecks(cluster.id);
          };
        }
        // show spinner on rerun button
        const runningInflightCheck = wasRunClicked || isValidatorRunning;
        return (
          <Alert variant="warning" isInline title="User action required" className="pf-v5-u-mt-md">
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
                      <span className="pf-v5-u-mr-sm">
                        <Spinner size="sm" />
                      </span>
                    )}
                    <Button
                      variant={ButtonVariant.link}
                      isInline
                      isDisabled={runningInflightCheck}
                      onClick={rerunValidator}
                    >
                      {isValidatorRunning
                        ? 'Network validation in progress'
                        : 'Rerun network validation'}
                    </Button>

                    {isErrorOpen && (
                      <ErrorModal
                        title="Error Rerunning Validator "
                        errorResponse={rerunInflightCheckReq}
                        resetResponse={() => setIsErrorOpen(false)}
                      />
                    )}
                  </FlexItem>
                </Flex>
              </FlexItem>
            </Flex>
          </Alert>
        );
      }
    }
    return null;
  };

  const showRequiredGCPRoles = () => {
    if (isOSDGCPWaitingForRolesOnHostProject(cluster)) {
      const hostProjectId = cluster?.gcp_network?.vpc_project_id;
      const serviceAccountsStrings = cluster?.status?.description?.match(emailRegex);
      const serviceAccountsLength = serviceAccountsStrings ? serviceAccountsStrings.length : 0;
      const serviceAccounts = serviceAccountsStrings ? (
        <>
          {serviceAccountsStrings.map((account, index) => (
            <React.Fragment key={account}>
              <strong>{account}</strong>
              {index < serviceAccountsStrings.length - 1 && ', '}
            </React.Fragment>
          ))}
        </>
      ) : (
        <strong>unknown</strong>
      );
      const reason = [];
      reason.push('To continue cluster installation, contact the VPC owner of the ');
      reason.push(<strong>{hostProjectId}</strong>);
      reason.push(' host project, who must grant the ');
      reason.push(serviceAccounts);
      reason.push(` service account${serviceAccountsLength > 1 ? 's' : ''} the following roles: `);
      reason.push(<strong>Compute Network Administrator, </strong>);
      reason.push(<strong>Compute Security Administrator, </strong>);
      reason.push(<strong>DNS Administrator.</strong>);
      return (
        <Alert variant="warning" isInline title="Permissions needed:" className="pf-v5-u-mt-md">
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
  };

  if (status.status.id === cluster.id) {
    const errorCode = status.status.provision_error_code || '';
    const alerts = [];

    // Cluster install failure
    if (status.status.state === clusterStates.ERROR) {
      alerts.push(
        <Alert
          variant="danger"
          isInline
          title={`${errorCode} Cluster installation failed`}
          className="pf-v5-u-mt-md"
        >
          <p>
            This cluster cannot be recovered, however you can use the logs and network validation to
            diagnose the problem:
          </p>
          <ClusterStatusErrorDisplay clusterStatus={status.status} showDescription />
        </Alert>,
      );
    }

    // Rosa inflight error check found urls missing from byo vpc firewall
    if (hasNetworkOndemand) {
      alerts.push(showMissingURLList());
    }

    // OSD GCP is waiting on roles to be added to dynamically generated service account for a shared vpc project
    alerts.push(showRequiredGCPRoles());

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
          data-testid="alert-long-install"
          className="pf-v5-u-mt-md"
        >
          <ClusterStatusErrorDisplay clusterStatus={status.status} />
        </Alert>,
      );
    }
    return <>{alerts.filter((n) => n)}</>;
  }
  return null;
};

ClusterStatusMonitor.propTypes = {
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
  hasNetworkOndemand: PropTypes.bool,
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
};

export default ClusterStatusMonitor;
