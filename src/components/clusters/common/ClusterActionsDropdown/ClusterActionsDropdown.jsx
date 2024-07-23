import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { Dropdown, MenuToggle, Tooltip } from '@patternfly/react-core';
import EllipsisVIcon from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon';

import { dropDownItems } from './ClusterActionsDropdownItems';

const ClusterActionsDropdown = (props) => {
  const [isOpen, setIsOpen] = useState(false);

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
  } = props;

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = () => {
    setIsOpen(false);
  };

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

  const toggleRef = useRef();

  const dropdown = (
    <Dropdown
      onSelect={onSelect}
      popperProps={{ position: 'right', appendTo: () => document.body }}
      toggle={{
        toggleRef,
        toggleNode: (
          <MenuToggle
            ref={toggleRef}
            onClick={onToggle}
            isExpanded={isOpen}
            isDisabled={disabled}
            variant={isKebab ? 'plain' : 'default'}
            data-testid="cluster-actions-dropdown"
          >
            {isKebab ? <EllipsisVIcon /> : 'Actions'}
          </MenuToggle>
        ),
      }}
      isOpen={isOpen}
      data-testid="cluster-actions-dropdown"
    >
      {menuItems}
    </Dropdown>
  );

  return disabled ? (
    <Tooltip
      content="You do not have permission to make changes in this cluster. Only cluster owners, cluster editors, and Organization Administrators can make these changes."
      position="bottom"
    >
      {dropdown}
    </Tooltip>
  ) : (
    dropdown
  );
};

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
