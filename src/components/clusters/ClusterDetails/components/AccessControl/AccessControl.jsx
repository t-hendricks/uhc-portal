import React from 'react';
import PropTypes from 'prop-types';

import UsersSection from './UsersSection';
import IDPSection from './IDPSection';
import NetworkSelfServiceSection from './NetworkSelfServiceSection';

function AccessControl({ clusterID, clusterConsoleURL, cloudProvider }) {
  return (
    <div className="cluster-details-user-tab-contents">
      <IDPSection clusterID={clusterID} clusterConsoleURL={clusterConsoleURL} />
      <UsersSection clusterID={clusterID} />
      {cloudProvider === 'aws' && (<NetworkSelfServiceSection clusterID={clusterID} />)}
    </div>
  );
}

AccessControl.propTypes = {
  clusterID: PropTypes.string.isRequired,
  clusterConsoleURL: PropTypes.string.isRequired,
  cloudProvider: PropTypes.string.isRequired,
};

export default AccessControl;
