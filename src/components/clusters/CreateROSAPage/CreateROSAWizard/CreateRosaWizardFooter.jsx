import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { isAsyncValidating } from 'redux-form';

import { WizardFooter, WizardContext, Button } from '@patternfly/react-core';

import { stepId, hasLoadingState } from './rosaWizardConstants';

// Must return the step in which VPCDropdown is located, as it's in charge of fetching the VPCs
const getVpcLoadingStep = (isHypershiftSelected) => {
  if (isHypershiftSelected) {
    return stepId.CLUSTER_SETTINGS__MACHINE_POOL;
  }

  return stepId.NETWORKING__VPC_SETTINGS;
};

const CreateRosaWizardFooter = ({
  firstStepId,
  onBeforeNext,
  onBeforeSubmit,
  onSubmit,
  isHypershiftSelected,
  isNextDisabled,
  currentStepId,
}) => {
  const asyncValidating = useSelector(isAsyncValidating('CreateCluster'));
  const awsRequests = useSelector((state) => ({
    accountIDsLoading: state.rosaReducer.getAWSAccountIDsResponse.pending || false,
    accountARNsLoading: state.rosaReducer.getAWSAccountRolesARNsResponse.pending || false,
    userRoleLoading: state.rosaReducer.getUserRoleResponse.pending || false,
    oCMRoleLoading: state.rosaReducer.getOCMRoleResponse.pending || false,
    vpcsLoading: state.ccsInquiries.vpcs.pending || false,
  }));

  const isRefreshingVPCs =
    awsRequests.vpcsLoading && currentStepId === getVpcLoadingStep(isHypershiftSelected);

  const areAwsResourcesLoading =
    awsRequests.accountIDsLoading ||
    awsRequests.accountARNsLoading ||
    awsRequests.userRoleLoading ||
    awsRequests.oCMRoleLoading ||
    isRefreshingVPCs;

  return (
    <WizardFooter>
      <WizardContext.Consumer>
        {({ activeStep, onNext, onBack, onClose }) => (
          <>
            {activeStep.id === stepId.REVIEW_AND_CREATE ? (
              <Button
                variant="primary"
                type="submit"
                data-testid="create-cluster-button"
                onClick={() => onBeforeSubmit(onSubmit)}
              >
                Create cluster
              </Button>
            ) : (
              <Button
                variant="primary"
                type="submit"
                data-testid="wizard-next-button"
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
            <Button
              variant="secondary"
              data-testid="wizard-back-button"
              onClick={onBack}
              isDisabled={activeStep.id === firstStepId}
            >
              Back
            </Button>
            <Button variant="link" data-testid="wizard-cancel-button" onClick={onClose}>
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
  isHypershiftSelected: PropTypes.bool,
  isNextDisabled: PropTypes.bool,
  currentStepId: PropTypes.string,
};

export default CreateRosaWizardFooter;
