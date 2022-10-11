import React from 'react';
import PropTypes from 'prop-types';

import { Card, CardTitle, CardBody, Title, TextVariants, Text } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import clusterStates, { isWaitingROSAManualMode } from '../clusterStates';
import ProgressList from './ProgressList';
import DownloadOcCliButton from './DownloadOcCliButton';
import CancelClusterButton from './CancelClusterButton';

function InstallProgress({ cluster, children }) {
  const isWaitingROSAManual = isWaitingROSAManualMode(cluster);
  let titleText;
  if (cluster.state === clusterStates.UNINSTALLING) {
    titleText = 'Uninstallation logs';
  } else if (isWaitingROSAManual) {
    titleText = 'Action required to continue installation';
  } else {
    titleText = 'Installing cluster';
  }

  return (
    <Card>
      <CardTitle>
        <Title headingLevel="h2" size="lg" className="card-title logview-title pf-u-mr-md">
          {!isWaitingROSAManual && <Spinner size="sm" className="progressing-icon" />}
          {titleText}
        </Title>
        <CancelClusterButton cluster={cluster} />
        <DownloadOcCliButton />
        {!isWaitingROSAManual && (
          <Text component={TextVariants.p} className="expected-cluster-installation-text">
            Expect cluster installation to be completed within 60 minutes.
          </Text>)
        }
      </CardTitle>
      <CardBody>
        {children && children[0]}
        {(cluster.state === clusterStates.INSTALLING ||
          cluster.state === clusterStates.PENDING ||
          cluster.state === clusterStates.WAITING) && (
          <ProgressList cluster={cluster} actionRequiredInitialOpen />
        )}
        {children && children[1]}
      </CardBody>
    </Card>
  );
}

InstallProgress.propTypes = {
  cluster: PropTypes.object.isRequired,
  children: PropTypes.arrayOf(PropTypes.node),
};

export default InstallProgress;
