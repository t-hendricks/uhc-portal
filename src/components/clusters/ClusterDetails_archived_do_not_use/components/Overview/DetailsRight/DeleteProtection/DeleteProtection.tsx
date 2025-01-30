import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';

import ButtonWithTooltip from '~/components/common/ButtonWithTooltip';
import { openModal } from '~/components/common/Modal/ModalActions';
import modals from '~/components/common/Modal/modals';
import { useGlobalState } from '~/redux/hooks';

type DelteProtectionProps = {
  protectionEnabled: boolean;
  clusterID: string;
  canToggle: boolean;
  isUninstalling?: boolean;
};

const DeleteProtection = ({
  protectionEnabled,
  clusterID,
  canToggle,
  isUninstalling,
}: DelteProtectionProps) => {
  const dispatch = useDispatch();
  const disableToggleReason =
    !canToggle &&
    `You do not have permission to ${protectionEnabled ? 'disable' : 'enable'} Delete Protection. Only cluster owners, cluster editors, and Organization Administrators can ${protectionEnabled ? 'disable' : 'enable'} Delete Protection.`;

  const clusterDetails = useGlobalState((state) => state.clusters.details);
  const updateDeleteProtection = useGlobalState(
    (state) => state.deleteProtection.updateDeleteProtection,
  );
  const [isDisabled, setIsDisabled] = useState(false);

  // disabling button when update begins
  useEffect(() => {
    if (updateDeleteProtection.pending) setIsDisabled(true);
  }, [updateDeleteProtection.pending]);

  // re-enabling button when refresh ends or in case of an error
  useEffect(() => {
    if (clusterDetails.fulfilled || updateDeleteProtection.error) setIsDisabled(false);
  }, [clusterDetails.fulfilled, updateDeleteProtection.error]);

  return (
    <DescriptionListGroup>
      <DescriptionListTerm>{`Delete Protection: ${protectionEnabled ? 'Enabled' : 'Disabled'}`}</DescriptionListTerm>
      <DescriptionListDescription>
        {!isUninstalling ? (
          <ButtonWithTooltip
            isDisabled={isDisabled}
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
        ) : (
          <span>N/A</span>
        )}
      </DescriptionListDescription>
    </DescriptionListGroup>
  );
};

export default DeleteProtection;
