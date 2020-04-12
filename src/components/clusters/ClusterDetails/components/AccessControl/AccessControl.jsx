import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import UsersSection from './UsersSection';
import IDPSection from './IDPSection';
import NetworkSelfServiceSection from './NetworkSelfServiceSection';

function AccessControl({ cluster, clusterConsoleURL, cloudProvider }) {
  return (
    <div className="cluster-details-user-tab-contents">
      <IDPSection clusterID={get(cluster, 'id')} clusterConsoleURL={clusterConsoleURL} />
      <UsersSection cluster={cluster} />
      {cloudProvider === 'aws' && (<NetworkSelfServiceSection clusterID={get(cluster, 'id')} />)}
    </div>
  );
}

AccessControl.propTypes = {
  cluster: PropTypes.object.isRequired,
  clusterConsoleURL: PropTypes.string.isRequired,
  cloudProvider: PropTypes.string.isRequired,
};

export default AccessControl;
