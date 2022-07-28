import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { WizardFooter, WizardContext, Button } from '@patternfly/react-core';

const CreateRosaWizardFooter = ({ onBeforeNext, onBeforeSubmit, onSubmit }) => {
  const { pending: getAccountIDsLoading } = useSelector(
    state => state.rosaReducer.getAWSAccountIDsResponse,
  );
  const { pending: getAccountARNsLoading } = useSelector(
    state => state.rosaReducer.getAWSAccountRolesARNsResponse,
  );
  const { pending: getUserRoleLoading } = useSelector(
    state => state.rosaReducer.getUserRoleResponse,
  );
  const { pending: getOCMRoleLoading } = useSelector(
    state => state.rosaReducer.getOCMRoleResponse,
  );

  const areAwsResourcesLoading = getAccountIDsLoading
    || getAccountARNsLoading || getUserRoleLoading || getOCMRoleLoading;

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
              ? (
                <Button
                  variant="primary"
                  type="submit"
                  onClick={() => onBeforeSubmit(onSubmit)}
                >
                  Create cluster
                </Button>
              ) : (
                <Button
                  variant="primary"
                  type="submit"
                  onClick={() => onBeforeNext(onNext)}
                  isLoading={areAwsResourcesLoading}
                  isDisabled={areAwsResourcesLoading}
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
  onBeforeSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CreateRosaWizardFooter;
