// CreateClusterDropdown is a button that shows a dropdown allowing to create OSD or OCP clusters
import React from 'react';
import PropTypes from 'prop-types';
import {
  DropdownButton, MenuItem,
} from 'patternfly-react';
import { LinkContainer } from 'react-router-bootstrap';

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
      <LinkContainer to="/install">
        <MenuItem eventKey="1">
          Self-Installed Cluster
        </MenuItem>
      </LinkContainer>
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
