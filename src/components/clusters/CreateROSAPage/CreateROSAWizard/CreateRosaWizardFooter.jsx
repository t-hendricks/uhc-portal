import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { WizardFooter, WizardContext, Button } from '@patternfly/react-core';

const CreateRosaWizardFooter = ({ onBeforeNext, onSubmit }) => {
  const { pending: getAwsAccountRolesLoading } = useSelector(
    state => state.rosaReducer.getAWSAccountRolesARNsResponse,
  );

  return (
    <WizardFooter>
      <WizardContext.Consumer>
        {({
          activeStep,
          onNext,
          onBack,
          onClose,
        }) => (
          <>
            {activeStep.name === 'Review and create'
              ? <Button variant="primary" type="submit" onClick={onSubmit}>Create cluster</Button>
              : (
                <Button
                  variant="primary"
                  type="submit"
                  onClick={() => onBeforeNext(onNext)}
                  isDisabled={getAwsAccountRolesLoading}
                >
                  Next
                </Button>
              )}
            <Button
              variant="secondary"
              onClick={onBack}
              {...activeStep.name === 'Accounts and roles' && { isDisabled: true }}
            >
              Back
            </Button>
            <Button variant="link" onClick={onClose}>
              Cancel
            </Button>
          </>
        )}
      </WizardContext.Consumer>
    </WizardFooter>
  );
};

CreateRosaWizardFooter.propTypes = {
  onBeforeNext: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CreateRosaWizardFooter;
