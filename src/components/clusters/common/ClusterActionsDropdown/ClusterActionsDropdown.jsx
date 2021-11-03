import React from 'react';
import PropTypes from 'prop-types';
import {
  Dropdown, DropdownToggle, KebabToggle, DropdownPosition, Tooltip,
} from '@patternfly/react-core';
import { dropDownItems } from './ClusterActionsDropdownItems';

class ClusterActionsDropdown extends React.Component {
  constructor(props) {
    super(props);
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

  state = {
    isOpen: false,
  }

  render() {
    const {
      cluster,
      showConsoleButton,
      openModal,
      isKebab,
      disabled,
      canSubscribeOCP,
      canTransferClusterOwnership,
      toggleSubscriptionReleased,
      canHibernateCluster,
      refreshFunc,
    } = this.props;
    const { isOpen } = this.state;

    const toggleComponent = isKebab
      ? <KebabToggle isDisabled={disabled} onToggle={this.onToggle} />
      : <DropdownToggle isDisabled={disabled} onToggle={this.onToggle}>Actions</DropdownToggle>;

    const menuItems = dropDownItems({
      cluster,
      showConsoleButton,
      openModal,
      canSubscribeOCP,
      canTransferClusterOwnership,
      canHibernateCluster,
      toggleSubscriptionReleased,
      refreshFunc,
      inClusterList: false,
    });

    const dropdown = (
      <Dropdown
        position={DropdownPosition.right}
        onSelect={this.onSelect}
        dropdownItems={menuItems}
        toggle={toggleComponent}
        isPlain={isKebab}
        isOpen={isOpen}
        data-test-id="cluster-actions-dropdown"
      />
    );

    if (disabled) {
      return (
        <Tooltip
          content="You do not have permission to make changes in this cluster. Only cluster owners, cluster editors, and organization administrators can make these changes."
          position="bottom"
        >
          {dropdown}
        </Tooltip>
      );
    }
    return dropdown;
  }
}

ClusterActionsDropdown.propTypes = {
  cluster: PropTypes.object.isRequired,
  showConsoleButton: PropTypes.bool.isRequired,
  openModal: PropTypes.func.isRequired,
  isKebab: PropTypes.bool,
  disabled: PropTypes.bool,
  canSubscribeOCP: PropTypes.bool.isRequired,
  canTransferClusterOwnership: PropTypes.bool.isRequired,
  canHibernateCluster: PropTypes.bool.isRequired,
  toggleSubscriptionReleased: PropTypes.func.isRequired,
  refreshFunc: PropTypes.func.isRequired,
};

export default ClusterActionsDropdown;
