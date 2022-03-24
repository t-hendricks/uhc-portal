import React from 'react';
import PropTypes from 'prop-types';

import { Wizard } from '@patternfly/react-core';
import Modal from '../../../../../common/Modal/Modal';
import AuthenticateScreen from './AuthenticateScreen';
import OCMRoleScreen from './OCMRoleScreen';
import UserRoleScreen from './UserRoleScreen';

class AssociateAWSAccountWizard extends React.Component {
  state = {
    stepIdReached: 1,
  }

  onNext = ({ id }) => {
    const { stepIdReached } = this.state;
    if (id && stepIdReached < id) {
      this.setState({ stepIdReached: id });
    }
  }

  render() {
    const { stepIdReached } = this.state;
    const { closeModal, token, onClose } = this.props;
    const steps = [
      {
        id: 1,
        name: 'Authenticate',
        component: <AuthenticateScreen token={token} />,
      },
      {
        id: 2,
        name: 'AWS account association',
        steps: [
          {
            id: 3,
            name: 'OCM role',
            component: <OCMRoleScreen />,
            canJumpTo: stepIdReached >= 3,
          },
          {
            id: 4,
            name: 'User role',
            component: <UserRoleScreen />,
            canJumpTo: stepIdReached >= 4,
            nextButtonText: 'Ok',
          },
        ],
      },
    ];

    const handleClose = () => {
      closeModal();
      if (onClose) {
        onClose();
      }
    };

    return (
      <>
        <Wizard
          title="Associate AWS Account"
          description="Link your AWS account to your Red Hat account."
          className="ocm-upgrade-wizard"
          isOpen
          steps={steps}
          onSave={handleClose}
          onNext={this.onNext}
          onBack={this.onBack}
          onGoToStep={this.onGoToStep}
          onClose={handleClose}
        />
      </>
    );
  }
}

function AssociatedAWSAccountModal({
  closeModal, isOpen, isValid, token,
}) {
  return isOpen && (
    <Modal title="Associate AWS Account ID">
      <AssociateAWSAccountWizard
        isValid={isValid}
        closeModal={closeModal}
        token={token}
      />
    </Modal>
  );
}

AssociatedAWSAccountModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  isOpen: PropTypes.bool,
  isValid: PropTypes.bool,
  token: PropTypes.string,
};

AssociateAWSAccountWizard.propTypes = {
  closeModal: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  token: PropTypes.string,
};

AssociatedAWSAccountModal.defaultProps = {
  isOpen: false,
};

export default AssociatedAWSAccountModal;
