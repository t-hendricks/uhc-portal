import React from 'react';

import { Button, Modal, ModalVariant } from '@patternfly/react-core';
import {
  useWizardContext,
  useWizardFooter,
  Wizard,
  WizardHeader,
  WizardStep,
  WizardStepProps,
} from '@patternfly/react-core/dist/esm/next';

import AuthenticateScreen from './AuthenticateScreen';
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
    <Wizard
      onSave={onClose}
      onClose={onClose}
      header={
        <WizardHeader
          title="Associate AWS Account"
          description="Link your AWS account to your Red Hat account."
          onClose={onClose}
        />
      }
    >
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
          <UserRoleScreenStep name="User role" id="user-role" />,
        ]}
      />
    </Wizard>
  </Modal>
);

const UserRoleScreenStep = (props: WizardStepProps) => {
  const { onClose, onBack } = useWizardContext();

  useWizardFooter(
    React.useMemo(
      () => (
        <footer className="pf-c-wizard__footer">
          <Button variant="primary" onClick={onClose}>
            Ok
          </Button>
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button variant="link" onClick={onClose}>
            Cancel
          </Button>
        </footer>
      ),
      [onClose, onBack],
    ),
  );

  return (
    <WizardStep {...props}>
      <UserRoleScreen />
    </WizardStep>
  );
};
