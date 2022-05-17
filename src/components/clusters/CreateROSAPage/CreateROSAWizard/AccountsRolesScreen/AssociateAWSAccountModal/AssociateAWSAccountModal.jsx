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
    const {
      closeModal, onClose, token, hasAWSAccounts,
    } = this.props;
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
            component: <OCMRoleScreen hasAWSAccounts={hasAWSAccounts} />,
            canJumpTo: stepIdReached >= 3,
          },
          {
            id: 4,
            name: 'User role',
            component: <UserRoleScreen hasAWSAccounts={hasAWSAccounts} />,
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
      <Wizard
        title="Associate AWS Account"
        description="Link your AWS account to your Red Hat account."
        className="rosa-wizard"
        isOpen
        steps={steps}
        onSave={handleClose}
        onNext={this.onNext}
        onBack={this.onBack}
        onGoToStep={this.onGoToStep}
        onClose={handleClose}
      />
    );
  }
}

function AssociateAWSAccountModal({
  closeModal,
  isOpen,
  isValid,
  onClose,
  token,
  hasAWSAccounts,
}) {
  return isOpen && (
    <Modal title="Associate AWS Account ID">
      <AssociateAWSAccountWizard
        isValid={isValid}
        closeModal={closeModal}
        onClose={onClose}
        token={token}
        hasAWSAccounts={hasAWSAccounts}
      />
    </Modal>
  );
}

AssociateAWSAccountModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  isOpen: PropTypes.bool,
  isValid: PropTypes.bool,
  token: PropTypes.string,
  hasAWSAccounts: PropTypes.string,
};

AssociateAWSAccountWizard.propTypes = {
  closeModal: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  token: PropTypes.string,
  hasAWSAccounts: PropTypes.string,
};

AssociateAWSAccountModal.defaultProps = {
  isOpen: false,
};

export default AssociateAWSAccountModal;
