import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

import { Stack, StackItem } from '@patternfly/react-core';

import ErrorBox from '~/components/common/ErrorBox';
import Modal from '~/components/common/Modal/Modal';
import { closeModal } from '~/components/common/Modal/ModalActions';
import modals from '~/components/common/Modal/modals';
import {
  canMakeDecision,
  postAccessRequestDecision,
  resetCanMakeDecision,
} from '~/redux/actions/accessRequestActions';
import { useGlobalState } from '~/redux/hooks';
import {
  AccessRequest,
  AccessRequestStatusState,
  DecisionDecision,
} from '~/types/access_transparency.v1';

import { AccessRequestFieldId } from '../model/AccessRequestFieldId';

import AccessRequestDetails from './AccessRequestDetails';
import AccessRequestEdit from './AccessRequestEdit';
import AccessRequestStateIcon from './AccessRequestStateIcon';

const AccessRequestModalForm = () => {
  const dispatch = useDispatch();

  const { accessRequest, onClose } = useGlobalState((state) => state.modal.data) as {
    accessRequest?: AccessRequest;
    onClose: () => void;
  };
  const postAccessRequestDecisionState = useGlobalState(
    (state) => state.accessRequest.postAccessRequestDecision,
  );
  const canMakeDecisionState = useGlobalState((state) => state.accessRequest.canMakeDecision);
  const organizationId = useGlobalState((state) => state.userProfile?.organization?.details?.id);

  const [isLoading, setIsLoading] = useState(true);

  const isEditMode = useMemo(
    () => accessRequest?.status?.state === AccessRequestStatusState.Pending,
    [accessRequest],
  );

  const handleClose = useCallback(() => {
    dispatch(closeModal());
    onClose();
  }, [dispatch, onClose]);

  useEffect(
    () => () => {
      dispatch(resetCanMakeDecision());
    },
    [dispatch],
  );

  useEffect(() => {
    if (isEditMode && accessRequest?.subscription_id && organizationId) {
      dispatch(canMakeDecision(accessRequest.subscription_id, organizationId));
    }
  }, [accessRequest?.subscription_id, organizationId, isEditMode, dispatch]);

  useEffect(
    () =>
      setIsLoading(
        !accessRequest?.id ||
          canMakeDecisionState.pending ||
          postAccessRequestDecisionState.pending,
      ),
    [
      setIsLoading,
      accessRequest?.id,
      canMakeDecisionState.pending,
      postAccessRequestDecisionState.pending,
    ],
  );

  useEffect(() => {
    if (postAccessRequestDecisionState.fulfilled) {
      handleClose();
    }
  }, [handleClose, postAccessRequestDecisionState.fulfilled]);

  return accessRequest ? (
    <Formik
      initialValues={{
        [AccessRequestFieldId.State]: accessRequest.status?.state,
        [AccessRequestFieldId.Justification]: '',
      }}
      validationSchema={Yup.object({
        [AccessRequestFieldId.State]: Yup.string().required('Required'),
        [AccessRequestFieldId.Justification]: Yup.string()
          .trim()
          .matches(
            /^[a-zA-Z0-9-\s.&,;':_!"/$]+$/,
            'Only alphanumeric characters and punctuation marks are allowed',
          )
          .max(256, 'Must be 256 characters or less')
          .when([AccessRequestFieldId.State], {
            is: AccessRequestStatusState.Denied,
            then: (schema) => schema.required('The justification is required in case of denial.'),
          }),
      })}
      onSubmit={async (values) => {
        const decision = values[AccessRequestFieldId.State] as any as DecisionDecision;
        dispatch(
          postAccessRequestDecision(accessRequest.id!!, {
            decision,
            justification:
              decision === DecisionDecision.Denied
                ? values[AccessRequestFieldId.Justification]
                : undefined,
          }),
        );
      }}
    >
      {(formik) => (
        <Modal
          title="Access Request Details"
          onClose={handleClose}
          primaryText="Save"
          showPrimary={isEditMode}
          secondaryText={isEditMode ? 'Cancel' : 'Close'}
          onPrimaryClick={formik.handleSubmit}
          onSecondaryClick={handleClose}
          isPrimaryDisabled={
            isEditMode &&
            (!formik.isValid ||
              !formik.dirty ||
              formik.isSubmitting ||
              postAccessRequestDecisionState.pending)
          }
          id="access-request-modal"
          isPending={isLoading}
          help={<AccessRequestStateIcon accessRequest={accessRequest} />}
          footer={
            !postAccessRequestDecisionState.error && !canMakeDecisionState.error ? null : (
              <>
                {postAccessRequestDecisionState.error ? (
                  <Stack hasGutter>
                    <StackItem>
                      <ErrorBox
                        message="A problem occurred while saving access request"
                        response={{
                          errorMessage: postAccessRequestDecisionState.errorMessage,
                          errorDetails: postAccessRequestDecisionState.errorDetails,
                        }}
                      />
                    </StackItem>
                  </Stack>
                ) : null}
                {canMakeDecisionState.error ? (
                  <Stack hasGutter>
                    <StackItem>
                      <ErrorBox
                        message="A problem occurred while retrieving rights for making a decision"
                        response={{
                          errorMessage: canMakeDecisionState.errorMessage,
                          errorDetails: canMakeDecisionState.errorDetails,
                        }}
                      />
                    </StackItem>
                  </Stack>
                ) : null}
              </>
            )
          }
        >
          {isEditMode && !postAccessRequestDecisionState.error ? (
            <AccessRequestEdit
              accessRequest={accessRequest}
              userDecisionRights={canMakeDecisionState.allowed}
            />
          ) : (
            <AccessRequestDetails accessRequest={accessRequest} />
          )}
        </Modal>
      )}
    </Formik>
  ) : null;
};
AccessRequestModalForm.modalName = modals.ACCESS_REQUEST_DETAILS;

export default AccessRequestModalForm;
