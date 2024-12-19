import React from 'react';

const HibernateClusterUpgradeInProgress = ({ clusterName }: { clusterName: string }) => (
  <p>
    Moving <b>{clusterName}</b> to Hibernating state is not possible while the cluster is upgrading.
  </p>
);

export default HibernateClusterUpgradeInProgress;
