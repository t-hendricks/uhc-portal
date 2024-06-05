import React from 'react';
import { AxiosError } from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Button, Form, Stack, StackItem } from '@patternfly/react-core';

import ErrorBox from '~/components/common/ErrorBox';
import { NumberInputField } from '~/components/common/formik/NumberInputField';
import TextField from '~/components/common/formik/TextField';
import Modal from '~/components/common/Modal/Modal';
import { clusterService } from '~/services';
import type { BreakGlassCredential } from '~/types/clusters_mgmt.v1';

type BreakGlassCredentialNewModalProps = {
  clusterId: string;
  credentialList?: string[];
  onClose: () => void;
  isNewModalOpen: boolean;
};

export function BreakGlassCredentialNewModal(props: BreakGlassCredentialNewModalProps) {
  const { clusterId, isNewModalOpen, onClose, credentialList } = props;
  const [error, setError] = React.useState<AxiosError>();
  const [isPending, setIsPending] = React.useState(false);

  const submitCredentials = ({
    clusterId,
    data,
  }: {
    clusterId: string;
    data: BreakGlassCredential;
  }) => {
    const request = clusterService.postBreakGlassCredentials;
    return request(clusterId || '', data);
  };

  const addNHoursToCurrentTime = (hours: number): string => {
    const today = new Date();
    return new Date(today.setHours(today.getHours() + hours)).toISOString();
  };

  const handleClose = () => {
    setError(undefined);
    onClose();
  };

  return isNewModalOpen ? (
    <Formik
      initialValues={{
        username: '',
        expiration: 1,
      }}
      validationSchema={Yup.object({
        username: Yup.string()
          .matches(/^[a-zA-Z0-9-]+$/, 'Only alphanumeric characters and hyphens are allowed')
          .max(64, 'Must be 64 characters or less')
          .required('Required')
          .notOneOf(credentialList || [], 'Username already exists'),
        expiration: Yup.number()
          .integer('Only integer numbers allowed')
          .min(1)
          .max(24)
          .test('is-integer', 'expiration must be an integer', (value) => Number.isInteger(value)),
      })}
      onSubmit={async (values) => {
        setError(undefined);
        setIsPending(true);
        try {
          await submitCredentials({
            clusterId,
            data: {
              username: values.username,
              expiration_timestamp: addNHoursToCurrentTime(values.expiration || 1),
            },
          });
          onClose();
        } catch (err) {
          setError(err as AxiosError);
        } finally {
          setIsPending(false);
        }
      }}
    >
      {(formik) => (
        <Modal
          id="add-break-glass-credential-modal"
          title="Add break glass credential"
          onClose={handleClose}
          modalSize="small"
          description="Add a break glass credential to access the cluster."
          footer={
            <Stack hasGutter>
              {error && (
                <StackItem>
                  <ErrorBox
                    message="A problem occurred while adding credential"
                    response={{
                      errorMessage: (error.response?.data as any)?.reason,
                      operationID: (error.response?.data as any)?.operation_id,
                    }}
                  />
                </StackItem>
              )}

              <StackItem>
                <Button
                  onClick={formik.submitForm}
                  className="pf-v5-u-mr-md"
                  data-testid="submit-btn"
                  isDisabled={!formik.isValid || !formik.dirty || formik.isSubmitting || isPending}
                  isLoading={isPending}
                >
                  Add
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleClose}
                  isDisabled={formik.isSubmitting || isPending}
                >
                  Cancel
                </Button>
              </StackItem>
            </Stack>
          }
        >
          <Form>
            <TextField fieldId="username" label="Username" isRequired />
            <NumberInputField
              fieldId="expiration"
              label="Hours until credentials expire"
              isRequired
              min={1}
              max={24}
              helpText="Expiration time will be 1 - 24 hours from now."
            />
          </Form>
        </Modal>
      )}
    </Formik>
  ) : null;
}
