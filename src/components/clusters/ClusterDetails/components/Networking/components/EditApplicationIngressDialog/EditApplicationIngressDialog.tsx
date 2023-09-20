import React from 'react';
import { SubmitHandler } from 'redux-form';
import { Form, ModalVariant } from '@patternfly/react-core';

import { DefaultIngressFields } from '~/components/clusters/CreateOSDPage/CreateOSDWizard/NetworkScreen/DefaultIngressFields';
import Modal from '~/components/common/Modal/Modal';
import { BaseRequestState } from '~/redux/types';
import ErrorBox from '~/components/common/ErrorBox';
import { ErrorState } from '~/types/types';

type EditApplicationIngressDialogProps = {
  isOpen?: boolean;
  editClusterRoutersResponse?: BaseRequestState;
  closeModal?: () => void;
  reset: () => void;
  resetResponse?: () => void;
  handleSubmit: SubmitHandler<{}, {}, string>;

  valid: boolean;
  pristine: boolean;

  hasSufficientIngressEditVersion?: boolean;
  canEditLoadBalancer?: boolean;
  canShowLoadBalancer?: boolean;
};

const EditApplicationIngressDialog: React.FC<EditApplicationIngressDialogProps> = ({
  isOpen = false,
  editClusterRoutersResponse,
  closeModal = () => {},
  reset,
  handleSubmit,
  resetResponse = () => {},

  valid,
  pristine,

  hasSufficientIngressEditVersion,
  canEditLoadBalancer,
  canShowLoadBalancer,
}) => {
  if (!isOpen) {
    return null;
  }
  const editRoutersError = editClusterRoutersResponse?.error ? (
    <ErrorBox
      message="Error editing application ingress"
      response={editClusterRoutersResponse as unknown as ErrorState}
    />
  ) : null;

  const onClose = () => {
    reset();
    resetResponse();
    closeModal();
  };

  return (
    <Modal
      variant={ModalVariant.medium}
      primaryText="Save"
      secondaryText="Cancel"
      title="Edit application ingress"
      onClose={onClose}
      onPrimaryClick={handleSubmit as () => void}
      onSecondaryClick={onClose}
      isPending={editClusterRoutersResponse?.pending}
      isPrimaryDisabled={!valid || pristine}
    >
      {editRoutersError}
      <Form>
        <DefaultIngressFields
          isDay2
          hasSufficientIngressEditVersion={hasSufficientIngressEditVersion}
          canEditLoadBalancer={canEditLoadBalancer}
          canShowLoadBalancer={canShowLoadBalancer}
        />
      </Form>
    </Modal>
  );
};

export default EditApplicationIngressDialog;
