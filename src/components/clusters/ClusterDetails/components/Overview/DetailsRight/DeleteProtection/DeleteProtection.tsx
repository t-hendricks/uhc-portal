import React from 'react';
import { useDispatch } from 'react-redux';

import {
  Button,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';

import { openModal } from '~/components/common/Modal/ModalActions';
import modals from '~/components/common/Modal/modals';

const DeleteProtection = ({
  protectionEnabled,
  clusterID,
}: {
  protectionEnabled: boolean;
  clusterID: string;
}) => {
  const dispatch = useDispatch();

  return (
    <DescriptionListGroup>
      <DescriptionListTerm>{`Delete Protection: ${protectionEnabled ? 'Enabled' : 'Disabled'}`}</DescriptionListTerm>
      <DescriptionListDescription>
        <Button
          variant="link"
          isInline
          onClick={() =>
            dispatch(openModal(modals.DELETE_PROTECTION, { clusterID, protectionEnabled }))
          }
        >
          {`${protectionEnabled ? 'Disable' : 'Enable'}`}
        </Button>
      </DescriptionListDescription>
    </DescriptionListGroup>
  );
};

export default DeleteProtection;
