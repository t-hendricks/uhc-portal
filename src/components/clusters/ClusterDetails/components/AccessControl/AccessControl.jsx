import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import UsersSection from './UsersSection';
import IDPSection from './IDPSection';
import NetworkSelfServiceSection from './NetworkSelfServiceSection';
import { isHibernating } from '../../../common/clusterStates';

function AccessControl({ cluster, clusterConsoleURL, cloudProvider }) {
  const clusterHibernating = isHibernating(cluster.state);
  return (
    <div className="cluster-details-user-tab-contents">
      <IDPSection
        clusterID={get(cluster, 'id')}
        clusterConsoleURL={clusterConsoleURL}
        canEdit={cluster.canEdit}
        clusterHibernating={clusterHibernating}
      />
      <UsersSection cluster={cluster} clusterHibernating={clusterHibernating} />
      {cloudProvider === 'aws' && !get(cluster, 'ccs.enabled', false) && (
        <NetworkSelfServiceSection
          clusterID={get(cluster, 'id')}
          canEdit={cluster.canEdit}
          clusterHibernating={clusterHibernating}
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
