import React from 'react';
import { Formik, useFormikContext, setNestedObjectValues } from 'formik';

import { Button, Modal, ModalVariant } from '@patternfly/react-core';
import {
  useWizardContext,
  Wizard,
  WizardHeader,
  WizardStep,
  WizardFooterWrapper,
} from '@patternfly/react-core/next';
import { scrollToFirstField } from '~/common/helpers';
import { OcmRoleScreen } from './OcmRoleScreen';
import { UserRoleScreen } from './UserRoleScreen';

import './associateAwsAccountModal.scss';

interface Props {
  isOpen: boolean;
  onClose(): void;
}

export const AssociateAwsAccountModal = ({ isOpen, onClose }: Props) => (
  <Modal
    isOpen={isOpen}
    variant={ModalVariant.large}
    showClose={false}
    hasNoBodyWrapper
    aria-label="Associate AWS account modal"
    className="associate-aws-account-modal"
    onEscapePress={onClose}
  >
    <Formik initialValues={{}} validateOnChange={false} onSubmit={onClose}>
      <Wizard
        onSave={onClose}
        onClose={onClose}
        isVisitRequired
        footer={<AssociateAwsAccountFooter />}
        header={
          <WizardHeader
            title="Associate AWS Account"
            description="Link your AWS account to your Red Hat account."
            onClose={onClose}
          />
        }
      >
        <WizardStep name="OCM role" id="ocm-role">
          <OcmRoleScreen />
        </WizardStep>
        <WizardStep name="User role" id="user-role">
          <UserRoleScreen />
        </WizardStep>
      </Wizard>
    </Formik>
  </Modal>
);

const AssociateAwsAccountFooter = () => {
  const { activeStep, steps, goToNextStep, goToPrevStep, close } = useWizardContext();
  const { validateForm, setTouched, submitForm } = useFormikContext();
  const isLastStep = activeStep.index === steps.length;

  const onNext = async () => {
    if (isLastStep) {
      submitForm();
      return;
    }

    const errors = await validateForm();
    const errorIds = Object.keys(errors);

    if (errorIds?.length > 0) {
      setTouched(setNestedObjectValues(errors, true));
      scrollToFirstField(errorIds);
      return;
    }

    goToNextStep();
  };

  return (
    <WizardFooterWrapper>
      <Button variant="primary" onClick={onNext}>
        {isLastStep ? 'Ok' : 'Next'}
      </Button>
      <Button variant="secondary" onClick={goToPrevStep} isDisabled={activeStep.index === 1}>
        Back
      </Button>
      <Button variant="link" onClick={close}>
        Cancel
      </Button>
    </WizardFooterWrapper>
  );
};
