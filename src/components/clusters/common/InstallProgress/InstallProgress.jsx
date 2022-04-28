import React from 'react';
import PropTypes from 'prop-types';

import {
  Card,
  CardTitle,
  CardBody,
  Title,
} from '@patternfly/react-core';

import clusterStates from '../clusterStates';
import ProgressList from './ProgressList';
import DownloadOcCliButton from './DownloadOcCliButton';
import CancelClusterButton from './CancelClusterButton';

function InstallProgress({ cluster, children }) {
  return (
    <Card>
      <CardTitle>
        <Title headingLevel="h2" size="lg" className="card-title logview-title pf-u-mr-md">
          {cluster.state === clusterStates.UNINSTALLING ? 'Uninstallation logs' : 'Installing cluster'}
        </Title>
        <CancelClusterButton cluster={cluster} />
        <DownloadOcCliButton />
      </CardTitle>
      <CardBody>
        {children && children[0]}
        { (cluster.state === clusterStates.INSTALLING
        || cluster.state === clusterStates.PENDING
        || cluster.state === clusterStates.WAITING) && (
          <ProgressList cluster={cluster} />
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
