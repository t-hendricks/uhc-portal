import React from 'react';
import { Formik, useFormikContext, setNestedObjectValues } from 'formik';

import { Button, Modal, ModalVariant } from '@patternfly/react-core';
import {
  useWizardContext,
  Wizard,
  WizardHeader,
  WizardStep,
  WizardFooterWrapper,
} from '@patternfly/react-core/dist/esm/next';

import { scrollToFirstError } from '~/common/helpers';
import AuthenticateScreen from './AuthenticateScreen';
import { OcmRoleScreen } from './OcmRoleScreen';
import { UserRoleScreen } from './UserRoleScreen';
import { RosaServiceScreen } from './RosaServiceScreen';

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
    <Formik initialValues={{}} onSubmit={onClose}>
      <Wizard
        onSave={onClose}
        onClose={onClose}
        isStepVisitRequired
        footer={<AssociateAwsAccountFooter />}
        header={
          <WizardHeader
            title="Associate AWS Account"
            description="Link your AWS account to your Red Hat account."
            onClose={onClose}
          />
        }
      >
        <WizardStep name="Enable ROSA service" id="enable-rosa-service">
          <RosaServiceScreen />
        </WizardStep>
        <WizardStep name="Authenticate" id="auth">
          <AuthenticateScreen />
        </WizardStep>
        <WizardStep
          name="AWS account association"
          id="associate-aws-account"
          steps={[
            <WizardStep name="OCM role" id="ocm-role">
              <OcmRoleScreen />
            </WizardStep>,
            <WizardStep name="User role" id="user-role">
              <UserRoleScreen />
            </WizardStep>,
          ]}
        />
      </Wizard>
    </Formik>
  </Modal>
);

const AssociateAwsAccountFooter = () => {
  const { activeStep, steps, onNext: goToNext, onBack, onClose } = useWizardContext();
  const { validateForm, setTouched, submitForm } = useFormikContext();
  const isLastStep = activeStep.index === steps.length;

  const onNext = async () => {
    if (isLastStep) {
      submitForm();
      return;
    }

    const errors = await validateForm();
    if (Object.keys(errors)?.length > 0) {
      setTouched(setNestedObjectValues(errors, true));
      scrollToFirstError(errors as Record<string, string>);
      return;
    }

    goToNext();
  };

  return (
    <WizardFooterWrapper>
      <Button variant="primary" onClick={onNext}>
        {isLastStep ? 'Ok' : 'Next'}
      </Button>
      <Button variant="secondary" onClick={onBack} isDisabled={activeStep.index === 1}>
        Back
      </Button>
      <Button variant="link" onClick={onClose}>
        Cancel
      </Button>
    </WizardFooterWrapper>
  );
};
