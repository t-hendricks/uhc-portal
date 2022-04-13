import React from 'react';
import PropTypes from 'prop-types';
import {
  ClipboardCopy,
  ProgressStepper,
  ProgressStep,
} from '@patternfly/react-core';
import UnknownIcon from '@patternfly/react-icons/dist/js/icons/unknown-icon';

// eslint-disable-next-line camelcase
import './ProgressList.scss';
import clusterStates from '../clusterStates';

function ProgressList({ cluster }) {
  const getProgressData = () => {
    const pending = { text: 'Pending', variant: 'pending' };
    const completed = { variant: 'success', text: 'Completed' };
    const unknown = { icon: <UnknownIcon className="icon-space-right" />, text: 'Unknown' };

    // first step in progress
    if (cluster.state === clusterStates.PENDING || cluster.state === clusterStates.WAITING) {
      let pendingText = 'Preparing account';
      if (!cluster.status.oidc_ready && cluster?.aws?.sts?.oidc_endpoint_url) {
        // Display OIDC endpoint URL but don't link to it
        pendingText = (
          <>
            Waiting for OIDC configuration
            <ClipboardCopy isReadOnly className="pf-u-mt-sm">{cluster.aws.sts.oidc_endpoint_url}</ClipboardCopy>
          </>
        );
      }
      return {
        awsAccountSetup: { variant: 'info', text: pendingText, isCurrent: true },
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
