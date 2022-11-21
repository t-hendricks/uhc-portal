import React from 'react';
import PropTypes from 'prop-types';

import { Card, CardTitle, CardBody, Title, TextVariants, Text } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import clusterStates, { isWaitingROSAManualMode } from '../clusterStates';
import ProgressList from './ProgressList';
import DownloadOcCliButton from './DownloadOcCliButton';

function InstallProgress({ cluster, children }) {
  const isErrorState = cluster.state === clusterStates.ERROR;
  const isWaitingROSAManual = isWaitingROSAManualMode(cluster);
  const inProgress = !isErrorState && !isWaitingROSAManual;

  let titleText;
  if (isErrorState) {
    titleText = 'Installation error';
  } else if (cluster.state === clusterStates.UNINSTALLING) {
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
          {inProgress && <Spinner size="sm" className="progressing-icon" />}
          {titleText}
        </Title>
        <DownloadOcCliButton />
        {inProgress && (
          <Text component={TextVariants.p} className="expected-cluster-installation-text">
            Cluster creation usually takes 30 to 60 minutes to complete.
          </Text>
        )}
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
