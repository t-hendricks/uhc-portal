import React from 'react';
import { useDispatch } from 'react-redux';

import {
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';

import ButtonWithTooltip from '~/components/common/ButtonWithTooltip';
import { openModal } from '~/components/common/Modal/ModalActions';
import modals from '~/components/common/Modal/modals';

const DeleteProtection = ({
  protectionEnabled,
  clusterID,
  canToggle,
}: {
  protectionEnabled: boolean;
  clusterID: string;
  canToggle: boolean;
}) => {
  const dispatch = useDispatch();
  const disableToggleReason =
    !canToggle &&
    `You do not have permission to ${protectionEnabled ? 'disable' : 'enable'} Delete Protection. Only cluster owners, cluster editors, and Organization Administrators can ${protectionEnabled ? 'disable' : 'enable'} Delete Protection.`;

  return (
    <DescriptionListGroup>
      <DescriptionListTerm>{`Delete Protection: ${protectionEnabled ? 'Enabled' : 'Disabled'}`}</DescriptionListTerm>
      <DescriptionListDescription>
        <ButtonWithTooltip
          variant="link"
          isInline
          onClick={() =>
            dispatch(openModal(modals.DELETE_PROTECTION, { clusterID, protectionEnabled }))
          }
          disableReason={disableToggleReason}
          isAriaDisabled={!!disableToggleReason}
        >
          {`${protectionEnabled ? 'Disable' : 'Enable'}`}
        </ButtonWithTooltip>
      </DescriptionListDescription>
    </DescriptionListGroup>
  );
};

export default DeleteProtection;
