import React from 'react';
import PropTypes from 'prop-types';

import UsersSection from './UsersSection';
import IDPSection from './IDPSection';

function AccessControl({ clusterID, clusterConsoleURL }) {
  return (
    <div className="cluster-details-user-tab-contents">
      <IDPSection clusterID={clusterID} clusterConsoleURL={clusterConsoleURL} />
      <UsersSection clusterID={clusterID} />
    </div>
  );
}

AccessControl.propTypes = {
  clusterID: PropTypes.string.isRequired,
  clusterConsoleURL: PropTypes.string.isRequired,
};

export default AccessControl;
