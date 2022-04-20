import React from 'react';
import PropTypes from 'prop-types';
import {
  ProgressStepper,
  ProgressStep,
} from '@patternfly/react-core';
import UnknownIcon from '@patternfly/react-icons/dist/js/icons/unknown-icon';

import './ProgressList.scss';
import ActionRequiredPopover from './ActionRequiredPopover';
import clusterStates, { isWaitingROSAManualMode } from '../clusterStates';

function ProgressList({ cluster }) {
  const getProgressData = () => {
    const pending = { variant: 'pending', text: 'Pending' };
    const completed = { variant: 'success', text: 'Completed' };
    const unknown = { icon: <UnknownIcon className="icon-space-right" />, text: 'Unknown' };

    if (isWaitingROSAManualMode(cluster)) {
      // Show a popover for manual creation of ROSA operator roles and OIDC provider.
      return {
        awsAccountSetup: { variant: 'info', text: <ActionRequiredPopover cluster={cluster} />, isCurrent: true },
        DNSSetup: pending,
        clusterInstallation: pending,
      };
    }

    // first step in progress
    if (cluster.state === clusterStates.PENDING || cluster.state === clusterStates.WAITING) {
      return {
        awsAccountSetup: { variant: 'info', text: 'Preparing account', isCurrent: true },
        DNSSetup: pending,
        clusterInstallation: pending,
      };
    }

    // first step completed
    if (cluster.state === clusterStates.INSTALLING) {
      if (!cluster.status.dns_ready) {
        return {
          awsAccountSetup: completed,
          DNSSetup: { variant: 'info', text: 'Setting up DNS', isCurrent: true },
          clusterInstallation: pending,
        };
      }
      // second step completed
      return {
        awsAccountSetup: completed,
        DNSSetup: completed,
        clusterInstallation: { variant: 'info', text: 'Installing cluster', isCurrent: true },
      };
    }
    return {
      awsAccountSetup: unknown,
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
