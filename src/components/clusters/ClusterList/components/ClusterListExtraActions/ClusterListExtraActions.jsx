import React from 'react';
import { Dropdown, DropdownItem, KebabToggle } from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class ClusterListExtraActions extends React.Component {
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
    const { isOpen } = this.state;
    const dropdownItems = [
      <DropdownItem key="registercluster">
        <div>
          <Link to="/register" className="pf-c-dropdown__menu-item">
            Register cluster
          </Link>
        </div>
      </DropdownItem>,
      <DropdownItem key="archived">
        <div>
          <Link to="archived" className="pf-c-dropdown__menu-item">
            Show archived clusters
          </Link>
        </div>
      </DropdownItem>,
    ];
    return (
      <Dropdown
        onSelect={this.onSelect}
        toggle={<KebabToggle onToggle={this.onToggle} />}
        isOpen={isOpen}
        isPlain
        dropdownItems={dropdownItems}
      />
    );
  }
}

ClusterListExtraActions.propTypes = {
  currentFlags: PropTypes.shape({
    showArchived: PropTypes.bool.isRequired,
  }).isRequired,
};

export default ClusterListExtraActions;
