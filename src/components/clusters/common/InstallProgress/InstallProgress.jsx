import React from 'react';
import PropTypes from 'prop-types';
import {
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  Card,
  CardTitle,
  CardBody,
  Title,
} from '@patternfly/react-core';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import InProgressIcon from '@patternfly/react-icons/dist/js/icons/in-progress-icon';
import PedningIcon from '@patternfly/react-icons/dist/js/icons/pending-icon';
import UnknownIcon from '@patternfly/react-icons/dist/js/icons/unknown-icon';
// eslint-disable-next-line camelcase
import { global_success_color_100 } from '@patternfly/react-tokens';
import clusterStates from '../clusterStates';

function InstallProgress({ cluster, children }) {
  const getProgressData = () => {
    const pending = { icon: <PedningIcon className="icon-space-right" />, text: 'Pending' };
    const completed = { icon: <CheckCircleIcon className="icon-space-right" color={global_success_color_100.value} />, text: 'Completed' };
    const unknown = { icon: <UnknownIcon className="icon-space-right" />, text: 'Unknown' };
    const inProgressIcon = <InProgressIcon className="icon-space-right" />;

    // first step in progress
    if (cluster.state === clusterStates.PENDING) {
      return {
        awsAccountSetup: { icon: inProgressIcon, text: 'preparing account' },
        DNSSetup: pending,
        clusterInstallation: pending,
      };
    }

    // first step completed
    if (cluster.state === clusterStates.INSTALLING) {
      if (!cluster.dns_ready) {
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
        clusterInstallation: { icon: inProgressIcon, text: 'installing cluster' },
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
    <Card>
      <CardTitle>
        <Title headingLevel="h2" size="lg" className="card-title logview-title">
          {cluster.state === clusterStates.UNINSTALLING ? 'Uninstallation logs' : 'Installing cluster'}
        </Title>
      </CardTitle>
      <CardBody>
        {children[0]}
        { (cluster.state === clusterStates.INSTALLING
        || cluster.state === clusterStates.PENDING) && (
        <DescriptionList>
          <DescriptionListGroup>
            <DescriptionListTerm>AWS account setup</DescriptionListTerm>
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
        )}
        {children[1]}
      </CardBody>
    </Card>
  );
}

InstallProgress.propTypes = {
  cluster: PropTypes.object.isRequired,
  children: PropTypes.arrayOf(PropTypes.node),
};

export default InstallProgress;
