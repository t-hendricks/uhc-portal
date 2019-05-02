// CreateClusterDropdown is a button that shows a dropdown allowing to create OSD or OCP clusters
import React from 'react';
import PropTypes from 'prop-types';
import {
  DropdownButton, MenuItem,
} from 'patternfly-react';

function CreateClusterDropdown(props) {
  const { showCreationForm, showOCPCreationForm, hasQuota } = props;
  return (
    <DropdownButton
      bsStyle="primary"
      title="Create Cluster"
      id="dropdown-example"
      bsSize="large"
      className="cluster-list-top"
    >
      <MenuItem eventKey="1" href={APP_EMBEDDED ? '/openshift/install' : '/install'} target="_blank">
          Self-Installed Cluster
      </MenuItem>
      {hasQuota && (
        <React.Fragment>
          <MenuItem eventKey="2" onClick={showOCPCreationForm}>
            Self-Managed Cluster
          </MenuItem>
          <MenuItem eventKey="3" onClick={showCreationForm}>
            Red Hat-Managed Cluster
          </MenuItem>
        </React.Fragment>
      )}
    </DropdownButton>
  );
}

CreateClusterDropdown.propTypes = {
  showCreationForm: PropTypes.func.isRequired,
  showOCPCreationForm: PropTypes.func.isRequired,
  hasQuota: PropTypes.bool.isRequired,
};

export default CreateClusterDropdown;
