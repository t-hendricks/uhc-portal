import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import UsersSection from './UsersSection';
import IDPSection from './IDPSection';
import NetworkSelfServiceSection from './NetworkSelfServiceSection';
import { isHibernating } from '../../../common/clusterStates';

function AccessControl({ cluster, clusterConsoleURL, cloudProvider }) {
  const clusterHibernating = isHibernating(cluster.state);
  const isReadOnly = cluster?.status?.configuration_mode === 'read_only';
  return (
    <div className="cluster-details-user-tab-contents">
      <IDPSection
        clusterID={get(cluster, 'id')}
        clusterConsoleURL={clusterConsoleURL}
        canEdit={cluster.canEdit}
        clusterHibernating={clusterHibernating}
        isReadOnly={isReadOnly}
      />
      <UsersSection
        cluster={cluster}
        clusterHibernating={clusterHibernating}
        isReadOnly={isReadOnly}
      />
      {cloudProvider === 'aws' && !get(cluster, 'ccs.enabled', false) && (
        <NetworkSelfServiceSection
          clusterID={get(cluster, 'id')}
          canEdit={cluster.canEdit}
          clusterHibernating={clusterHibernating}
          isReadOnly={isReadOnly}
        />
      )}
    </div>
  );
}

AccessControl.propTypes = {
  cluster: PropTypes.object.isRequired,
  clusterConsoleURL: PropTypes.string.isRequired,
  cloudProvider: PropTypes.string.isRequired,
};

export default AccessControl;
