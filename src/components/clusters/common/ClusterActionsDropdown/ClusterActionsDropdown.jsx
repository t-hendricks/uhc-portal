import React from 'react';
import PropTypes from 'prop-types';

import { Tooltip } from '@patternfly/react-core';
import {
  Dropdown as DropdownDeprecated,
  DropdownPosition as DropdownPositionDeprecated,
  DropdownToggle as DropdownToggleDeprecated,
  KebabToggle as KebabToggleDeprecated,
} from '@patternfly/react-core/deprecated';

import { dropDownItems } from './ClusterActionsDropdownItems';

class ClusterActionsDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.onToggle = (_, isOpen) => {
      this.setState({
        isOpen,
      });
    };
    this.onSelect = () => {
      this.setState((state) => ({
        isOpen: !state.isOpen,
      }));
    };
  }

  state = {
    isOpen: false,
  };

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
      deleteProtectionEnabled,
    } = this.props;
    const { isOpen } = this.state;

    const toggleComponent = isKebab ? (
      <KebabToggleDeprecated isDisabled={disabled} onToggle={this.onToggle} />
    ) : (
      <DropdownToggleDeprecated isDisabled={disabled} onToggle={this.onToggle}>
        Actions
      </DropdownToggleDeprecated>
    );

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
      deleteProtectionEnabled,
    });

    const dropdown = (
      <DropdownDeprecated
        position={DropdownPositionDeprecated.right}
        onSelect={this.onSelect}
        dropdownItems={menuItems}
        toggle={toggleComponent}
        isPlain={isKebab}
        isOpen={isOpen}
        data-testid="cluster-actions-dropdown"
      />
    );

    if (disabled) {
      return (
        <Tooltip
          content="You do not have permission to make changes in this cluster. Only cluster owners, cluster editors, and Organization Administrators can make these changes."
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
  deleteProtectionEnabled: PropTypes.bool.isRequired,
};

export default ClusterActionsDropdown;
