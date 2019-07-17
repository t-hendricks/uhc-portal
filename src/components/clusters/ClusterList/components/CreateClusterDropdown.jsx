// CreateClusterDropdown is a button that shows a dropdown allowing to create OSD or OCP clusters
import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownItem } from '@patternfly/react-core';
import { Link } from 'react-router-dom';


class CreateClusterDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.onToggle = (isOpen) => {
      this.setState({
        isOpen,
      });
    };
    this.onSelect = () => {
      this.setState(state => ({
        isOpen: !state.isOpen,
      }));
    };
  }

  render() {
    const { showCreationForm, hasQuota } = this.props;
    const { isOpen } = this.state;
    const menuItems = [
      <DropdownItem key="selfmanaged">
        <Link to="/install">
          Self-Installed Cluster
        </Link>
      </DropdownItem>,
      hasQuota && (
      <DropdownItem component="button" key="managed" onClick={showCreationForm}>
        Red Hat-Managed Cluster
      </DropdownItem>),
    ].filter(Boolean);
    return (
      <Dropdown
        onSelect={this.onSelect}
        dropdownItems={menuItems}
        toggle={<DropdownToggle className="pf-c-button pf-m-primary" onToggle={this.onToggle}>Create Cluster</DropdownToggle>}
        isOpen={isOpen}
      />
    );
  }
}

CreateClusterDropdown.propTypes = {
  showCreationForm: PropTypes.func.isRequired,
  hasQuota: PropTypes.bool.isRequired,
};

export default CreateClusterDropdown;
