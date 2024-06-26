import React, { useCallback, useEffect, useMemo } from 'react';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

import { Stack, StackItem } from '@patternfly/react-core';

import ErrorBox from '~/components/common/ErrorBox';
import Modal from '~/components/common/Modal/Modal';
import { closeModal } from '~/components/common/Modal/ModalActions';
import modals from '~/components/common/Modal/modals';
import { postAccessRequestDecision } from '~/redux/actions/accessRequestActions';
import { useGlobalState } from '~/redux/hooks';
import { AccessRequest, Decision } from '~/types/access_transparency.v1';

import { AccessRequestFieldId } from '../model/AccessRequestFieldId';
import { AccessRequestState } from '../model/AccessRequestState';

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
  const canUpdateClusterResource = useGlobalState(
    (state) => state.clusters.details.cluster.canUpdateClusterResource,
  );

  const isEditMode = useMemo(
    () => accessRequest?.status?.state === AccessRequestState.PENDING,
    [accessRequest],
  );

  const handleClose = useCallback(() => {
    dispatch(closeModal());
    onClose();
  }, [dispatch, onClose]);

  useEffect(() => {
    if (postAccessRequestDecisionState.fulfilled) {
      handleClose();
    }
  }, [handleClose, postAccessRequestDecisionState.fulfilled]);

  return accessRequest ? (
    <Formik
      initialValues={{
        [AccessRequestFieldId.State]: accessRequest?.status?.state,
        [AccessRequestFieldId.Justification]: '',
      }}
      validationSchema={Yup.object({
        [AccessRequestFieldId.State]: Yup.string().required('Required'),
        [AccessRequestFieldId.Justification]: Yup.string()
          .matches(
            /^[a-zA-Z0-9-\s.&,;':_!"/$]+$/,
            'Only alphanumeric characters and punctuation marks are allowed',
          )
          .max(256, 'Must be 256 characters or less')
          .when([AccessRequestFieldId.State], {
            is: AccessRequestState.DENIED,
            then: (schema) => schema.required('Required'),
          }),
      })}
      onSubmit={async (values) => {
        dispatch(
          postAccessRequestDecision(accessRequest.id!!, {
            decision: values[AccessRequestFieldId.State] as Decision.decision,
            justification: values[AccessRequestFieldId.Justification],
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
          isPending={accessRequest === undefined || postAccessRequestDecisionState.pending}
          help={<AccessRequestStateIcon accessRequest={accessRequest} />}
          footer={
            postAccessRequestDecisionState.error ? (
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
            ) : null
          }
        >
          {isEditMode && !postAccessRequestDecisionState.error ? (
            <AccessRequestEdit
              accessRequest={accessRequest}
              userDecisionRights={canUpdateClusterResource}
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
