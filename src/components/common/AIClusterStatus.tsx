import React from 'react';

import { Bullseye, Spinner } from '@patternfly/react-core';
import { ScalprumComponent } from '@scalprum/react-core';

const AIClusterStatus = ({ status, className }: { status?: string; className?: string }) => {
  const clusterStatusProps = {
    status: status ?? '',
    className: className ?? '',
  };

  return (
    <ScalprumComponent
      {...clusterStatusProps}
      scope="assistedInstallerApp"
      module="./ClusterStatus"
      fallback={
        <Bullseye>
          <Spinner />
        </Bullseye>
      }
    />
  );
};

export default AIClusterStatus;
