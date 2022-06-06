import React from 'react';
import PropTypes from 'prop-types';
import {
  ProgressStepper,
  ProgressStep,
} from '@patternfly/react-core';
import UnknownIcon from '@patternfly/react-icons/dist/js/icons/unknown-icon';
import InProgressIcon from '@patternfly/react-icons/dist/js/icons/in-progress-icon';
import PendingIcon from '@patternfly/react-icons/dist/js/icons/pending-icon';
import './ProgressList.scss';
import ActionRequiredLink from './ActionRequiredLink';
import clusterStates, { isROSA, isWaitingROSAManualMode } from '../clusterStates';

function ProgressList({ cluster }) {
  const isROSACluster = isROSA(cluster);
  const isWaitingAndROSAManualMode = isWaitingROSAManualMode(cluster);

  const getProgressData = () => {
    const pending = { variant: 'pending', icon: <PendingIcon />, text: 'Pending' };
    const completed = { variant: 'success', text: 'Completed' };
    const unknown = { icon: <UnknownIcon className="icon-space-right" />, text: 'Unknown' };

    // first step in progress
    if (!isROSACluster
      && (cluster.state === clusterStates.WAITING || cluster.state === clusterStates.PENDING)) {
      return {
        awsAccountSetup: {
          variant: 'info',
          text: 'Preparing account',
          isCurrent: true,
          icon: <InProgressIcon />,
        },
        DNSSetup: pending,
        clusterInstallation: pending,
      };
    }

    if (isROSACluster) {
      if (isWaitingAndROSAManualMode) {
        // Show link to Action required modal for manual creation of ROSA operator roles and
        // OIDC provider.
        return {
          awsAccountSetup: completed,
          oidcAndOperatorRolesSetup: {
            variant: 'warning',
            text: <ActionRequiredLink cluster={cluster} />,
            isCurrent: true,
          },
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
            variant: 'info',
            text: 'Pending',
            isCurrent: true,
            icon: <InProgressIcon />,
          },
          DNSSetup: pending,
          clusterInstallation: pending,
        };
      }
    }

    // first steps completed
    if (cluster.state === clusterStates.INSTALLING) {
      if (!cluster.status.dns_ready) {
        return {
          awsAccountSetup: completed,
          oidcAndOperatorRolesSetup: completed,
          DNSSetup: {
            variant: 'info',
            text: 'Setting up DNS',
            isCurrent: true,
            icon: <InProgressIcon />,
          },
          clusterInstallation: pending,
        };
      }
      // second step completed
      return {
        awsAccountSetup: completed,
        oidcAndOperatorRolesSetup: completed,
        DNSSetup: completed,
        clusterInstallation: {
          variant: 'info',
          text: 'Installing cluster',
          isCurrent: true,
          icon: <InProgressIcon />,
        },
      };
    }
    return {
      awsAccountSetup: unknown,
      oidcAndOperatorRolesSetup: unknown,
      DNSSetup: unknown,
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
};

export default ProgressList;
