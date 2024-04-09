import React from 'react';

import modals from '~/components/common/Modal/modals';

import ButtonWithTooltip from '../../../../../common/ButtonWithTooltip';

type AddNotificationContactButtonProps = {
  canEdit?: boolean;
  openModal: (modalId: string) => void;
};

const AddNotificationContactButton = ({
  canEdit,
  openModal,
}: AddNotificationContactButtonProps) => (
  <ButtonWithTooltip
    disableReason={
      canEdit
        ? null
        : 'You do not have permission to add a Notification Contact. Only cluster owners, cluster editors, and Organization Administrators can add them.'
    }
    onClick={() => openModal(modals.ADD_NOTIFICATION_CONTACT)}
    variant="secondary"
    className="access-control-add"
  >
    Add notification contact
  </ButtonWithTooltip>
);

export default AddNotificationContactButton;
