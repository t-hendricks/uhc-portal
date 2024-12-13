import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { Dropdown, MenuToggle, Tooltip } from '@patternfly/react-core';
import EllipsisVIcon from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon';

import { useToggleSubscriptionReleased } from '~/queries/ClusterActionsQueries/useToggleSubscriptionReleased';

import { openModal } from '../../../common/Modal/ModalActions';

import { dropDownItems } from './ClusterActionsDropdownItems';

const ClusterActionsDropdown = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();

  const {
    cluster,
    showConsoleButton,
    isKebab,
    disabled,
    canSubscribeOCP,
    canTransferClusterOwnership,
    canHibernateCluster,
    refreshFunc,
  } = props;

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = () => {
    setIsOpen(false);
  };

  const { mutate: toggleSubscriptionReleased } = useToggleSubscriptionReleased();

  const menuItems = dropDownItems({
    cluster,
    showConsoleButton,
    openModal: (modalName, data) => dispatch(openModal(modalName, data)),
    canSubscribeOCP,
    canTransferClusterOwnership,
    canHibernateCluster,
    refreshFunc,
    inClusterList: false,
    toggleSubscriptionReleased,
  });

  const toggleRef = useRef();

  const dropdown = (
    <Dropdown
      onSelect={onSelect}
      popperProps={{ position: 'right', appendTo: () => document.body }}
      onOpenChange={(isOpen) => setIsOpen(isOpen)}
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
  isKebab: PropTypes.bool,
  disabled: PropTypes.bool,
  canSubscribeOCP: PropTypes.bool.isRequired,
  canTransferClusterOwnership: PropTypes.bool.isRequired,
  canHibernateCluster: PropTypes.bool.isRequired,
  refreshFunc: PropTypes.func.isRequired,
};

export default ClusterActionsDropdown;
