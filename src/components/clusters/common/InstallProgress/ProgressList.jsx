import React from 'react';
import PropTypes from 'prop-types';
import {
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  Spinner,
} from '@patternfly/react-core';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import PedningIcon from '@patternfly/react-icons/dist/js/icons/pending-icon';
import UnknownIcon from '@patternfly/react-icons/dist/js/icons/unknown-icon';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';

import { global_success_color_100 as successColor, global_warning_color_100 as warningColor } from '@patternfly/react-tokens';
import './ProgressList.scss';
import ActionRequiredPopover from './ActionRequiredPopover';
import clusterStates, { isWaitingROSAManualMode } from '../clusterStates';

function ProgressList({ cluster }) {
  const getProgressData = () => {
    const pending = { icon: <PedningIcon className="icon-space-right" />, text: 'Pending' };
    const completed = { icon: <CheckCircleIcon className="icon-space-right" color={successColor.value} />, text: 'Completed' };
    const unknown = { icon: <UnknownIcon className="icon-space-right" />, text: 'Unknown' };
    const inProgressIcon = <Spinner className="icon-space-right" size="sm" />;

    if (isWaitingROSAManualMode(cluster)) {
      // Show a popover for manual creation of ROSA operator roles and OIDC provider.
      return {
        awsAccountSetup: {
          icon: <ExclamationTriangleIcon className="icon-space-right" color={warningColor.value} />,
          text: <ActionRequiredPopover cluster={cluster} />,
        },
        DNSSetup: pending,
        clusterInstallation: pending,
      };
    }

    // first step in progress
    if (cluster.state === clusterStates.PENDING || cluster.state === clusterStates.WAITING) {
      return {
        awsAccountSetup: { icon: inProgressIcon, text: 'Preparing account' },
        DNSSetup: pending,
        clusterInstallation: pending,
      };
    }

    // first step completed
    if (cluster.state === clusterStates.INSTALLING) {
      if (!cluster.status.dns_ready) {
        return {
          awsAccountSetup: completed,
          DNSSetup: pending,
          clusterInstallation: pending,
        };
      }
      // second step completed
      return {
        awsAccountSetup: completed,
        DNSSetup: completed,
        clusterInstallation: { icon: inProgressIcon, text: 'Installing cluster' },
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
    <DescriptionList>
      <DescriptionListGroup>
        <DescriptionListTerm>Account setup</DescriptionListTerm>
        <DescriptionListDescription>
          {progressData.awsAccountSetup.icon}
          {progressData.awsAccountSetup.text}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>DNS setup</DescriptionListTerm>
        <DescriptionListDescription>
          {progressData.DNSSetup.icon}
          {progressData.DNSSetup.text}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Cluster installation</DescriptionListTerm>
        <DescriptionListDescription>
          {progressData.clusterInstallation.icon}
          {progressData.clusterInstallation.text}
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
}

ProgressList.propTypes = {
  cluster: PropTypes.object.isRequired,
};

export default ProgressList;
