import React from 'react';
import PropTypes from 'prop-types';

import UsersSection from './UsersSection';
import IDPSection from './IDPSection';

function AccessControl({ clusterID }) {
  return (
    <div className="cluster-details-user-tab-contents">
      <IDPSection clusterID={clusterID} />
      <UsersSection clusterID={clusterID} />
    </div>
  );
}

AccessControl.propTypes = {
  clusterID: PropTypes.string.isRequired,
};

export default AccessControl;
