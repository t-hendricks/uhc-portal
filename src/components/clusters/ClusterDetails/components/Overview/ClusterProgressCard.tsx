import React from 'react';
import {
  Text,
  Card,
  Title,
  Spinner,
  CardBody,
  CardTitle,
  TextVariants,
} from '@patternfly/react-core';

import { Cluster } from '~/types/clusters_mgmt.v1';
import clusterStates, {
  isWaitingROSAManualMode,
  isWaitingHypershiftCluster,
} from '~/components/clusters/common/clusterStates';
import UninstallProgress from '~/components/clusters/common/UninstallProgress';
import InstallProgress from '~/components/clusters/common/InstallProgress/InstallProgress';
import DownloadOcCliButton from '~/components/clusters/common/InstallProgress/DownloadOcCliButton';
import InstallationLogView from './InstallationLogView';
import ClusterStatusMonitor from './ClusterStatusMonitor';
import { isHypershiftCluster } from '../../clusterDetailsHelper';

interface ClusterProgressCardProps {
  cluster?: Cluster;
  history: Object;
  refresh?: Function;
}

const ClusterProgressCard = ({ cluster = {}, history, refresh }: ClusterProgressCardProps) => {
  const isError = cluster.state === clusterStates.ERROR;
  const isPending = cluster.state === clusterStates.PENDING;
  const isValidating = cluster.state === clusterStates.VALIDATING;
  const isInstalling = cluster.state === clusterStates.INSTALLING;
  const isUninstalling = cluster.state === clusterStates.UNINSTALLING;
  const isWaitingROSAManual = isWaitingROSAManualMode(cluster);
  const isWaitingHypershift = isWaitingHypershiftCluster(cluster);
  const installationInProgress =
    (isPending || isInstalling || isWaitingHypershift || isValidating || !isWaitingROSAManual) &&
    !isError;
  const inProgress = (installationInProgress || isUninstalling) && !isError;
  const estCompletionTime = isHypershiftCluster(cluster) ? '10' : '30 to 60';

  let titleText;
  if (isError) {
    titleText = 'Installation error';
  } else if (isUninstalling) {
    titleText = 'Uninstalling cluster';
  } else if (isWaitingROSAManual) {
    titleText = 'Action required to continue installation';
  } else if (installationInProgress) {
    titleText = 'Installing cluster';
  }

  return (
    <Card>
      <CardTitle>
        <Title
          headingLevel="h2"
          size="lg"
          className="card-title pf-u-display-inline-block pf-u-mr-md"
        >
          {inProgress && <Spinner size="sm" className="progressing-icon pf-u-mr-md" />}
          {titleText}
        </Title>
        {(installationInProgress || isWaitingROSAManual) && !isUninstalling && (
          <DownloadOcCliButton />
        )}
        {installationInProgress && !isUninstalling && (
          <Text component={TextVariants.p} className="expected-cluster-installation-text">
            Cluster creation usually takes {estCompletionTime} minutes to complete.
          </Text>
        )}
      </CardTitle>
      <CardBody>
        <ClusterStatusMonitor cluster={cluster} refresh={refresh} history={history} />
        {isUninstalling ? (
          <UninstallProgress cluster={cluster} />
        ) : (
          <InstallProgress cluster={cluster} />
        )}
        <InstallationLogView isExpandable={!isUninstalling} cluster={cluster} />
      </CardBody>
    </Card>
  );
};

export default ClusterProgressCard;
