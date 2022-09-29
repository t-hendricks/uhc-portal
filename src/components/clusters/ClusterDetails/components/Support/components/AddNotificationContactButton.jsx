import React from 'react';
import PropTypes from 'prop-types';

import ButtonWithTooltip from '../../../../../common/ButtonWithTooltip';

const AddNotificationContactButton = ({ canEdit, openModal }) => (
  <ButtonWithTooltip
    disableReason={
      canEdit
        ? null
        : 'You do not have permission to add a Notification Contact. Only cluster owners, cluster editors, and Organization Administrators can add them.'
    }
    onClick={() => openModal('add-notification-contact')}
    variant="secondary"
    className="access-control-add"
  >
    Add notification contact
  </ButtonWithTooltip>
);

AddNotificationContactButton.propTypes = {
  canEdit: PropTypes.bool.isRequired,
  openModal: PropTypes.func.isRequired,
};

export default AddNotificationContactButton;
