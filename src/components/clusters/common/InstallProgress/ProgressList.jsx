import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { ProgressStepper, ProgressStep, Spinner } from '@patternfly/react-core';
import UnknownIcon from '@patternfly/react-icons/dist/js/icons/unknown-icon';
import { InflightCheckState } from '~/types/clusters_mgmt.v1';
import './ProgressList.scss';
import ActionRequiredLink from './ActionRequiredLink';
import clusterStates, {
  isROSA,
  isWaitingHypershiftCluster,
  isWaitingROSAManualMode,
} from '../clusterStates';

function ProgressList({ cluster, inflightChecks, actionRequiredInitialOpen }) {
  const inflightRef = useRef([]);
  const isROSACluster = isROSA(cluster);
  const isWaitingAndROSAManual = isWaitingROSAManualMode(cluster);
  const isWaitingHypershift = isWaitingHypershiftCluster(cluster);

  const getProgressData = () => {
    const pending = { variant: 'pending' };
    const inProcess = { variant: 'info', icon: <Spinner size="sm" />, isCurrent: true };
    const completed = { variant: 'success', text: 'Completed' };
    const warning = { variant: 'warning', text: 'Some steps failed' };
    const failed = { variant: 'danger', text: 'Failed' };
    const unknown = { icon: <UnknownIcon className="icon-space-right" />, text: 'Unknown' };

    // first step in progress
    if (
      !isROSACluster &&
      (cluster.state === clusterStates.WAITING || cluster.state === clusterStates.PENDING)
    ) {
      return {
        awsAccountSetup: {
          text: 'Preparing account',
          ...inProcess,
        },
        DNSSetup: pending,
        clusterInstallation: pending,
      };
    }

    if (isROSACluster) {
      if (isWaitingHypershift) {
        // Show waiting status for creation of ROSA operator roles and
        // OIDC provider.
        return {
          awsAccountSetup: completed,
          oidcAndOperatorRolesSetup: {
            text: 'Waiting',
            ...inProcess,
          },
          networkSettings: pending,
          DNSSetup: pending,
          clusterInstallation: pending,
        };
      }
      if (isWaitingAndROSAManual) {
        // Show link to Action required modal for manual creation of ROSA operator roles and
        // OIDC provider.
        return {
          awsAccountSetup: completed,
          oidcAndOperatorRolesSetup: {
            variant: 'warning',
            text: (
              <ActionRequiredLink cluster={cluster} initiallyOpen={actionRequiredInitialOpen} />
            ),
            isCurrent: true,
          },
          networkSettings: pending,
          DNSSetup: pending,
          clusterInstallation: pending,
        };
      }
      // Rosa cluster when pending means waiting on OIDC and operator roles to be detected
      // This state occurs for auto mode or after manual mode cli instructions have been executed
      if (cluster.state === clusterStates.PENDING) {
        return {
          awsAccountSetup: completed,
          oidcAndOperatorRolesSetup: {
            text: 'Pending',
            ...inProcess,
          },
          networkSettings: pending,
          DNSSetup: pending,
          clusterInstallation: pending,
        };
      }
    }

    // inflight checks are asynchronous
    // so dns/install status is running parallel with network settings
    if (inflightChecks.fulfilled) {
      inflightRef.current = inflightChecks.checks;
    }
    let networkSettings = completed;
    if (inflightRef.current.some((check) => check.state === InflightCheckState.FAILED)) {
      networkSettings = failed;
    } else if (inflightRef.current.some((check) => check.state === InflightCheckState.RUNNING)) {
      networkSettings = inProcess;
    }

    // first steps completed
    if (cluster.state === clusterStates.INSTALLING || cluster.state === clusterStates.VALIDATING) {
      if (!cluster.status.dns_ready) {
        return {
          awsAccountSetup: completed,
          oidcAndOperatorRolesSetup: completed,
          DNSSetup: {
            text: 'Setting up DNS',
            ...inProcess,
          },
          networkSettings: pending,
          clusterInstallation: pending,
        };
      }
      // second step completed
      return {
        awsAccountSetup: completed,
        oidcAndOperatorRolesSetup: completed,
        DNSSetup: completed,
        // because inflight runs asynchronously, both network and cluster install can be running at same time
        networkSettings,
        clusterInstallation: {
          text: 'Installing cluster',
          ...inProcess,
        },
      };
    }
    if (networkSettings !== completed) {
      return {
        awsAccountSetup: completed,
        oidcAndOperatorRolesSetup: completed,
        DNSSetup: completed,
        networkSettings,
        // if backend lets install proceed to end even though network setup was a failure, show warning
        // else don't show anything for install to emphysis network setting error
        clusterInstallation:
          networkSettings === failed && cluster.state === clusterStates.READY ? warning : pending,
      };
    }
    return {
      awsAccountSetup: unknown,
      oidcAndOperatorRolesSetup: unknown,
      DNSSetup: unknown,
      networkSettings: unknown,
      clusterInstallation: unknown,
    };
  };

  const progressData = getProgressData();

  return (
    <ProgressStepper>
      <ProgressStep
        variant={progressData.awsAccountSetup.variant}
        icon={progressData.awsAccountSetup.icon}
        isCurrent={progressData.awsAccountSetup.isCurrent}
        description={progressData.awsAccountSetup.text}
        id="awsAccountSetup"
        titleId="awsAccountSetup-title"
      >
        Account setup
      </ProgressStep>
      {isROSACluster && (
        <ProgressStep
          variant={progressData.oidcAndOperatorRolesSetup.variant}
          icon={progressData.oidcAndOperatorRolesSetup.icon}
          isCurrent={progressData.oidcAndOperatorRolesSetup.isCurrent}
          description={progressData.oidcAndOperatorRolesSetup.text}
          id="oidcAndOperatorRolesSetup"
          titleId="oidcAndOperatorRoles-title"
        >
          OIDC and operator roles
        </ProgressStep>
      )}
      <ProgressStep
        variant={progressData.DNSSetup.variant}
        icon={progressData.DNSSetup.icon}
        isCurrent={progressData.DNSSetup.isCurrent}
        description={progressData.DNSSetup.text}
        id="DNSSetup"
        titleId="DNSSetup-title"
      >
        DNS setup
      </ProgressStep>
      {isROSACluster && (
        <ProgressStep
          variant={progressData.networkSettings.variant}
          icon={progressData.networkSettings.icon}
          isCurrent={progressData.networkSettings.isCurrent}
          description={progressData.networkSettings.text}
          id="networkSettings"
          titleId="networkSettings-title"
        >
          Network settings
        </ProgressStep>
      )}
      <ProgressStep
        variant={progressData.clusterInstallation.variant}
        icon={progressData.clusterInstallation.icon}
        isCurrent={progressData.clusterInstallation.isCurrent}
        description={progressData.clusterInstallation.text}
        id="clusterInstallation"
        titleId="clusterInstallation-title"
      >
        Cluster installation
      </ProgressStep>
    </ProgressStepper>
  );
}

ProgressList.propTypes = {
  cluster: PropTypes.object.isRequired,
  inflightChecks: PropTypes.shape({
    pending: PropTypes.bool,
    fulfilled: PropTypes.bool,
    error: PropTypes.bool,
    checks: PropTypes.array,
  }),
  actionRequiredInitialOpen: PropTypes.bool,
};

export default ProgressList;
