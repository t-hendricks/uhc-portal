import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { isAsyncValidating } from 'redux-form';

import { WizardFooter, WizardContext, Button } from '@patternfly/react-core';

import { useGlobalState } from '~/redux/hooks';
import { stepId, hasLoadingState } from './rosaWizardConstants';

const CreateRosaWizardFooter = ({
  firstStepId,
  onBeforeNext,
  onBeforeSubmit,
  onSubmit,
  isNextDisabled,
}) => {
  const asyncValidating = useSelector(isAsyncValidating('CreateCluster'));
  const { pending: getAccountIDsLoading } = useSelector(
    (state) => state.rosaReducer.getAWSAccountIDsResponse,
  );
  const { pending: getAccountARNsLoading } = useSelector(
    (state) => state.rosaReducer.getAWSAccountRolesARNsResponse,
  );
  const { pending: getUserRoleLoading } = useSelector(
    (state) => state.rosaReducer.getUserRoleResponse,
  );
  const { pending: getOCMRoleLoading } = useSelector(
    (state) => state.rosaReducer.getOCMRoleResponse,
  );
  const { pending: isVpcsLoading } = useGlobalState((state) => state.ccsInquiries.vpcs);

  const areAwsResourcesLoading =
    getAccountIDsLoading ||
    getAccountARNsLoading ||
    getUserRoleLoading ||
    getOCMRoleLoading ||
    isVpcsLoading;

  return (
    <WizardFooter>
      <WizardContext.Consumer>
        {({ activeStep, onNext, onBack, onClose }) => (
          <>
            {activeStep.id === stepId.REVIEW_AND_CREATE ? (
              <Button variant="primary" type="submit" onClick={() => onBeforeSubmit(onSubmit)}>
                Create cluster
              </Button>
            ) : (
              <Button
                variant="primary"
                type="submit"
                onClick={() => onBeforeNext(onNext)}
                isLoading={
                  hasLoadingState(activeStep.id) && (asyncValidating || areAwsResourcesLoading)
                }
                isDisabled={
                  hasLoadingState(activeStep.id) && (isNextDisabled || areAwsResourcesLoading)
                }
              >
                Next
              </Button>
            )}
            <Button variant="secondary" onClick={onBack} isDisabled={activeStep.id === firstStepId}>
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
  firstStepId: PropTypes.string.isRequired,
  onBeforeNext: PropTypes.func.isRequired,
  onBeforeSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isNextDisabled: PropTypes.bool,
};

export default CreateRosaWizardFooter;
