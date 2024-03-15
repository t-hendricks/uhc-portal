import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Spinner,
  Text,
  TextVariants,
  Title,
} from '@patternfly/react-core';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { global_danger_color_100 as dangerColor } from '@patternfly/react-tokens/dist/esm/global_danger_color_100';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import { NETWORK_VALIDATOR_ONDEMAND_FEATURE } from '~/redux/constants/featureConstants';

import DownloadOcCliButton from '~/components/clusters/common/InstallProgress/DownloadOcCliButton';
import InstallProgress from '~/components/clusters/common/InstallProgress/InstallProgress';
import UninstallProgress from '~/components/clusters/common/UninstallProgress';
import clusterStates, {
  isHypershiftCluster,
  isWaitingHypershiftCluster,
  isWaitingROSAManualMode,
  hasInflightEgressErrors,
} from '~/components/clusters/common/clusterStates';
import { ClusterFromSubscription } from '~/types/types';
import InstallationLogView from './InstallationLogView';

interface ClusterProgressCardProps {
  cluster: ClusterFromSubscription;
}

const ClusterProgressCard = ({ cluster }: ClusterProgressCardProps) => {
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
  const hasInflightErrors = hasInflightEgressErrors(cluster);
  const hasNetworkOndemand = useFeatureGate(NETWORK_VALIDATOR_ONDEMAND_FEATURE);

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
      {!hasInflightErrors && (
        <CardTitle>
          <Title
            headingLevel="h2"
            size="lg"
            className="card-title pf-v5-u-display-inline-block pf-v5-u-mr-md"
          >
            {inProgress && <Spinner size="sm" className="progressing-icon pf-v5-u-mr-md" />}
            {isError && (
              <span className="pf-v5-u-mr-xs">
                <ExclamationCircleIcon color={dangerColor.value} />{' '}
              </span>
            )}
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
      )}
      <CardBody>
        {isUninstalling ? (
          <UninstallProgress cluster={cluster} />
        ) : (
          <InstallProgress
            cluster={cluster}
            hasNetworkOndemand={hasNetworkOndemand}
            hasInflightErrors={hasInflightErrors}
          />
        )}
        <InstallationLogView isExpandable={!isUninstalling} cluster={cluster} />
      </CardBody>
    </Card>
  );
};

export default ClusterProgressCard;
