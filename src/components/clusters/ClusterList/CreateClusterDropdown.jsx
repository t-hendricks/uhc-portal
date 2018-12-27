// CreateClusterDropdown is a button that shows a dropdown allowing to create OSD or OCP clusters
import React from 'react';
import PropTypes from 'prop-types';
import {
  DropdownButton, MenuItem,
} from 'patternfly-react';
import { LinkContainer } from 'react-router-bootstrap';


function CreateClusterDropdown(props) {
  const { showCreationForm } = props;
  return (
    <DropdownButton
      bsStyle="primary"
      title="Create Cluster"
      id="dropdown-example"
      bsSize="large"
      className="cluster-list-top"
    >
      <MenuItem eventKey="1" onClick={showCreationForm}>
        Red Hat-Managed Cluster
      </MenuItem>
      <LinkContainer to="/clusters/install">
        <MenuItem eventKey="2">
          Self-Managed Cluster
        </MenuItem>
      </LinkContainer>
    </DropdownButton>
  );
}

CreateClusterDropdown.propTypes = {
  showCreationForm: PropTypes.func.isRequired,
};

export default CreateClusterDropdown;
