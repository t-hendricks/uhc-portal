// CreateClusterDropdown is a button that shows a dropdown allowing to create OSD or OCP clusters
import React from 'react';
import PropTypes from 'prop-types';
import {
  DropdownButton, MenuItem,
} from 'patternfly-react';
import { LinkContainer } from 'react-router-bootstrap';

function CreateClusterDropdown(props) {
  const { showCreationForm, showOCPCreationForm } = props;
  return (
    <DropdownButton
      bsStyle="primary"
      title="Create Cluster"
      id="dropdown-example"
      bsSize="large"
      className="cluster-list-top"
    >
      <LinkContainer to="/install">
        <MenuItem eventKey="1">
          Self-Managed (Manual Install) Cluster
        </MenuItem>
      </LinkContainer>
      <MenuItem eventKey="2" onClick={showOCPCreationForm}>
        Self-Managed (Auto-Install) Cluster
      </MenuItem>
      <MenuItem eventKey="3" onClick={showCreationForm}>
        Red Hat-Managed Cluster
      </MenuItem>
    </DropdownButton>
  );
}

CreateClusterDropdown.propTypes = {
  showCreationForm: PropTypes.func.isRequired,
  showOCPCreationForm: PropTypes.func.isRequired,
};

export default CreateClusterDropdown;
