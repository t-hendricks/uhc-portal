import React from 'react';

import { Alert } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';

const HibernateClusterUpgradeScheduled = ({
  clusterName,
  nextRun,
}: {
  clusterName: string;
  nextRun: string;
}) => (
  <>
    <p>
      Moving <b>{clusterName}</b> cluster to Hibernating state is not possible while there is a
      scheduled cluster upgrade.
    </p>
    <Alert
      variant="warning"
      title={
        <p>
          There is a scheduled update to <DateFormat type="exact" date={Date.parse(nextRun)} />. The
          scheduled update cannot be executed if the cluster is hibernating.
        </p>
      }
    />
    <p>Try again after the cluster upgrade is done or cancel the upgrade.</p>
  </>
);

export default HibernateClusterUpgradeScheduled;
