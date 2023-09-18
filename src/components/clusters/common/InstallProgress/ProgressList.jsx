import React from 'react';
import PropTypes from 'prop-types';
import { ProgressStepper, ProgressStep, Spinner } from '@patternfly/react-core';
import UnknownIcon from '@patternfly/react-icons/dist/js/icons/unknown-icon';
import { InflightCheckState } from '~/types/clusters_mgmt.v1';
import './ProgressList.scss';
import ActionRequiredLink from './ActionRequiredLink';
import clusterStates, {
  isROSA,
  isWaitingROSAManualMode,
  isWaitingForOIDCProviderOrOperatorRolesMode,
  getInflightChecks,
} from '../clusterStates';

function ProgressList({ cluster, actionRequiredInitialOpen }) {
  const isROSACluster = isROSA(cluster);
  const isWaitingAndROSAManual = isWaitingROSAManualMode(cluster);
  const isWaitingForOIDCProviderOrOperatorRoles =
    isWaitingForOIDCProviderOrOperatorRolesMode(cluster);

  const getProgressData = () => {
    const pending = { variant: 'pending' };
    const inProcess = { variant: 'info', icon: <Spinner size="sm" />, isCurrent: true };
    const completed = { variant: 'success', text: 'Completed' };
    const warning = { variant: 'warning', text: 'Validation failed' };
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
        networkSettings: pending,
        clusterInstallation: pending,
      };
    }

    const inflightChecks = getInflightChecks(cluster);
    if (isROSACluster) {
      if (isWaitingForOIDCProviderOrOperatorRoles) {
        // Show link to Action required modal for creation of ROSA operator roles and
        // OIDC provider via oidc_config.id.
        return {
          awsAccountSetup: completed,
          oidcAndOperatorRolesSetup: {
            variant: 'warning',
            text: <ActionRequiredLink cluster={cluster} />,
            isCurrent: true,
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
      // Rosa cluster when pending means it has completed OIDC and operator roles step
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
      if (
        cluster.state === clusterStates.VALIDATING ||
        inflightChecks.some((check) => check.state === InflightCheckState.RUNNING)
      ) {
        return {
          awsAccountSetup: completed,
          oidcAndOperatorRolesSetup: completed,
          networkSettings: {
            text: 'Validating',
            ...inProcess,
          },
          DNSSetup: pending,
          clusterInstallation: pending,
        };
      }
    } // end if isRosaCluster

    // inflight check stop install
    const inflightError = inflightChecks.some((check) => check.state === InflightCheckState.FAILED);
    const inflightErrorStopInstall =
      cluster.state === clusterStates.ERROR && cluster.status.provision_error_code === 'OCM4001';
    if (inflightErrorStopInstall) {
      return {
        awsAccountSetup: completed,
        oidcAndOperatorRolesSetup: completed,
        networkSettings: {
          ...failed,
          text: 'Validation failed',
        },
        DNSSetup: pending,
        clusterInstallation: pending,
      };
    }

    // first steps completed
    const networkSettings = inflightError ? warning : completed;
    if (cluster.state === clusterStates.INSTALLING) {
      if (!cluster.status.dns_ready) {
        return {
          awsAccountSetup: completed,
          oidcAndOperatorRolesSetup: completed,
          networkSettings,
          DNSSetup: inProcess,
          clusterInstallation: pending,
        };
      }
      // second step completed
      return {
        awsAccountSetup: completed,
        oidcAndOperatorRolesSetup: completed,
        networkSettings,
        DNSSetup: completed,
        clusterInstallation: {
          text: 'Installing cluster',
          ...inProcess,
        },
      };
    }
    if (inflightError) {
      return {
        awsAccountSetup: completed,
        oidcAndOperatorRolesSetup: completed,
        DNSSetup: completed,
        networkSettings,
        clusterInstallation:
          cluster.state === clusterStates.ERROR && !inflightErrorStopInstall ? failed : completed,
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
        variant={progressData.DNSSetup.variant}
        icon={progressData.DNSSetup.icon}
        isCurrent={progressData.DNSSetup.isCurrent}
        description={progressData.DNSSetup.text}
        id="DNSSetup"
        titleId="DNSSetup-title"
      >
        DNS setup
      </ProgressStep>
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
  actionRequiredInitialOpen: PropTypes.bool,
};

export default ProgressList;
