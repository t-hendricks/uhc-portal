import React from 'react';
import { useDispatch } from 'react-redux';

import {
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';

import { openModal } from '~/components/common/Modal/ModalActions';
import modals from '~/components/common/Modal/modals';
import { useGlobalState } from '~/redux/hooks';

const DeleteProtection = ({ clusterID }: { clusterID: string }) => {
  const dispatch = useDispatch();
  const protectionEnabled = useGlobalState(
    (state) => state.deleteProtection.getDeleteProtection.enabled,
  );
  return (
    <DescriptionListGroup>
      <DescriptionListTerm>{`Delete Protection: ${protectionEnabled ? 'Enabled' : 'Disabled'}`}</DescriptionListTerm>
      <DescriptionListDescription>
        <a
          onClick={() =>
            dispatch(openModal(modals.DELETE_PROTECTION, { clusterID, protectionEnabled }))
          }
        >{`${protectionEnabled ? 'Disable' : 'Enable'}`}</a>
      </DescriptionListDescription>
    </DescriptionListGroup>
  );
};

export default DeleteProtection;
