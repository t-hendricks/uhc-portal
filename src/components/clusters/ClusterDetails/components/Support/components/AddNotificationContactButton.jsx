import React from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip } from '@patternfly/react-core';

const addBtn = (isDisabled, openModal) => (
  // eslint-disable-next-line react/jsx-filename-extension
  <Button
    onClick={() => openModal('add-notification-contact')}
    variant="secondary"
    className="access-control-add"
    isDisabled={isDisabled}
  >
    Add notification contact
  </Button>
);

const AddNotificationContactButton = ({
  canEdit,
  openModal,
}) => (
  canEdit
    ? addBtn(false, openModal)
    : (
      <Tooltip
        content="You do not have permission to add a Notification Contact. Only cluster owners and organization administrators can add them."
      >
        <span>
          {addBtn(true, openModal)}
        </span>
      </Tooltip>
    )
);

AddNotificationContactButton.propTypes = {
  canEdit: PropTypes.bool.isRequired,
  openModal: PropTypes.func.isRequired,
};

export default AddNotificationContactButton;
