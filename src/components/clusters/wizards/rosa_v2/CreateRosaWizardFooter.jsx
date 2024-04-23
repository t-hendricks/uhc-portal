import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Button } from '@patternfly/react-core';
import {
  WizardFooter as WizardFooterDeprecated,
  WizardContext as WizardContextDeprecated,
} from '@patternfly/react-core/deprecated';
import { setNestedObjectValues } from 'formik';
import { scrollToFirstField } from '~/common/helpers';
import { getScrollErrorIds } from '~/components/clusters/wizards/form/utils';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { stepId, hasLoadingState } from './rosaWizardConstants';
import { isUserRoleForSelectedAWSAccount } from './AccountsRolesScreen/AccountsRolesScreen';
import { FieldId } from './constants';

// Must return the step in which VPCDropdown is located, as it's in charge of fetching the VPCs
const getVpcLoadingStep = (isHypershiftSelected) => {
  if (isHypershiftSelected) {
    return stepId.CLUSTER_SETTINGS__MACHINE_POOL;
  }

  return stepId.NETWORKING__VPC_SETTINGS;
};

const CreateRosaWizardFooter = ({
  firstStepId,
  isHypershiftSelected,
  currentStepId,
  accountAndRolesStepId,
  getUserRoleResponse,
  getUserRoleInfo,
  isSubmitting = false,
}) => {
  const { activeStep, onNext, onBack, onClose } = useContext(WizardContextDeprecated);
  const { values, validateForm, setTouched, isValidating, submitForm } = useFormState();
  // used to determine the actions' disabled state.
  // (as a more exclusive rule than isValidating, which relying upon would block progress to the next step)
  const [isNextDeferred, setIsNextDeferred] = useState(false);

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

  const isButtonLoading = isValidating || areAwsResourcesLoading;
  const isButtonDisabled = isNextDeferred || areAwsResourcesLoading;

  const onValidateNext = async () => {
    // defer execution until any ongoing validation is done
    if (isValidating) {
      if (!isNextDeferred) {
        setIsNextDeferred(true);
      }
      return;
    }

    const errors = await validateForm(values);

    if (Object.keys(errors || {}).length > 0) {
      setTouched(setNestedObjectValues(errors, true));
      scrollToFirstField(getScrollErrorIds(errors, true));
      return;
    }

    // when navigating back to step 1 from link in no user-role error messages on review screen.
    if (currentStepId === accountAndRolesStepId && !getUserRoleResponse?.fulfilled) {
      const data = await getUserRoleInfo();
      const gotoNextStep = isUserRoleForSelectedAWSAccount(
        data.value,
        values[FieldId.AssociatedAwsId],
      );
      if (!gotoNextStep) {
        return;
      }
    }

    onNext();
  };

  useEffect(() => {
    // if "next" invocation was deferred due to earlier ongoing validation,
    // revive the invocation when the validation is done.
    if (isNextDeferred && isValidating === false) {
      setIsNextDeferred(false);
      onValidateNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidating, isNextDeferred]);

  return isSubmitting ? null : (
    <WizardFooterDeprecated>
      <>
        {activeStep.id === stepId.REVIEW_AND_CREATE ? (
          <Button
            variant="primary"
            data-testid="create-cluster-button"
            onClick={() => submitForm()}
          >
            Create cluster
          </Button>
        ) : (
          <Button
            variant="primary"
            data-testid="wizard-next-button"
            onClick={() => {
              onValidateNext();
            }}
            isLoading={hasLoadingState(activeStep.id) && isButtonLoading}
            isDisabled={hasLoadingState(activeStep.id) && isButtonDisabled}
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
    </WizardFooterDeprecated>
  );
};

CreateRosaWizardFooter.propTypes = {
  firstStepId: PropTypes.string.isRequired,
  isHypershiftSelected: PropTypes.bool,
  currentStepId: PropTypes.string,
  accountAndRolesStepId: PropTypes.string.isRequired,
  getUserRoleResponse: PropTypes.object.isRequired,
  getUserRoleInfo: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default CreateRosaWizardFooter;
