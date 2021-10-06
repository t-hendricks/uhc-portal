import React from 'react';
import PropTypes from 'prop-types';
import {
  ClipboardCopy,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  Spinner,
} from '@patternfly/react-core';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import PedningIcon from '@patternfly/react-icons/dist/js/icons/pending-icon';
import UnknownIcon from '@patternfly/react-icons/dist/js/icons/unknown-icon';

// eslint-disable-next-line camelcase
import { global_success_color_100 } from '@patternfly/react-tokens';
import './ProgressList.scss';
import clusterStates from '../clusterStates';

function ProgressList({ cluster }) {
  const getProgressData = () => {
    const pending = { icon: <PedningIcon className="icon-space-right" />, text: 'Pending' };
    const completed = { icon: <CheckCircleIcon className="icon-space-right" color={global_success_color_100.value} />, text: 'Completed' };
    const unknown = { icon: <UnknownIcon className="icon-space-right" />, text: 'Unknown' };
    const inProgressIcon = <Spinner className="icon-space-right" size="sm" />;

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
        awsAccountSetup: { icon: inProgressIcon, text: pendingText },
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
