import React from 'react';
import PropTypes from 'prop-types';
import {
  Dropdown, DropdownToggle, KebabToggle, DropdownPosition,
} from '@patternfly/react-core';
import { dropDownItems } from './ClusterActionsDropdownItems';

class ClusterActionsDropdown extends React.Component {
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
    const {
      cluster,
      showConsoleButton,
      openModal,
      isKebab,
      disabled,
    } = this.props;
    const { isOpen } = this.state;


    const toggleComponent = isKebab
      ? <KebabToggle isDisabled={disabled} onToggle={this.onToggle} />
      : <DropdownToggle isDisabled={disabled} onToggle={this.onToggle}>Actions</DropdownToggle>;

    const menuItems = dropDownItems({
      cluster, showConsoleButton, openModal,
    });
    return (
      <Dropdown
        position={DropdownPosition.right}
        onSelect={this.onSelect}
        dropdownItems={menuItems}
        toggle={toggleComponent}
        isPlain={isKebab}
        isOpen={isOpen}
      />
    );
  }
}

ClusterActionsDropdown.propTypes = {
  cluster: PropTypes.object.isRequired,
  showConsoleButton: PropTypes.bool.isRequired,
  openModal: PropTypes.func.isRequired,
  isKebab: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default ClusterActionsDropdown;
