import React from 'react';
import { Field, Formik } from 'formik';
import * as Yup from 'yup';

import {
  Button,
  ClipboardCopy,
  ClipboardCopyVariant,
  ExpandableSection,
  Form,
  Modal,
  Stack,
  StackItem,
} from '@patternfly/react-core';

import { getErrorMessage } from '~/common/errors';
import { validateSecureURL } from '~/common/validators';
import ErrorBox from '~/components/common/ErrorBox';
import TextField from '~/components/common/formik/TextField';
import { clusterService } from '~/services';
import { ExternalAuth } from '~/types/clusters_mgmt.v1';

import CAUpload from '../../IdentityProvidersPage/components/CAUpload';

import { getExternalAuthenticationProviderCommand } from './externalAuthHelper';

type ExternalAuthProviderModalProps = {
  clusterID: string;
  onClose: () => void;
  externalAuthProvider?: ExternalAuth;
  isEdit?: boolean;
  isOpen?: boolean;
};
type ExternalAuthenticationProvider = {
  id: string;
  issuer: string;
  groups: string;
  username: string;
  provider_ca?: string;
  audiences?: string;
};

const modalDescription =
  'An external authentication provider controls access to your cluster. You can add one provider to your cluster.';

const submitProvider = ({
  clusterID,
  values,
  externalAuthProviderId,
}: {
  clusterID: string;
  values: ExternalAuth;
  externalAuthProviderId?: string;
}) => {
  // Edit request
  if (externalAuthProviderId) {
    const request = clusterService.patchExternalAuth;
    return request(clusterID || '', externalAuthProviderId, values);
  }

  // Creation request
  const request = clusterService.postExternalAuth;
  return request(clusterID || '', values);
};

const buildExternalAuthProvider = (values: ExternalAuthenticationProvider): ExternalAuth => ({
  id: values.id,
  issuer: {
    url: values.issuer,
    audiences: values?.audiences?.split(',').map((audience) => audience.trim()),
    ca: values.provider_ca,
  },
  claim: {
    mappings: {
      username: {
        claim: values.username,
      },
      groups: {
        claim: values.groups,
      },
    },
  },
});

export function ExternalAuthProviderModal(props: ExternalAuthProviderModalProps) {
  const { clusterID, onClose, externalAuthProvider, isEdit, isOpen = true } = props;
  const [submitError, setSubmitError] = React.useState<any>();
  const [isExternalAuthExpanded, setIsExternalAuthExpanded] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);
  const formRef = React.useRef();
  const onExternalAuthToggle = () => {
    setIsExternalAuthExpanded(!isExternalAuthExpanded);
  };

  const extAuthProviderCliCommand = getExternalAuthenticationProviderCommand({
    clusterName: clusterID || '',
    providerName: (formRef?.current as any)?.id?.value || externalAuthProvider?.id || '',
    issuerUrl: (formRef?.current as any)?.issuer?.value || '',
    issuerAudiences: (formRef?.current as any)?.audiences?.value || '',
    groupsClaim: (formRef?.current as any)?.groups?.value || '',
    usernameClaim: (formRef?.current as any)?.username?.value || '',
    providerCA:
      (formRef?.current as any)?.file_input?.value || externalAuthProvider?.issuer?.ca || '',
  });

  return (
    <Formik
      initialValues={{
        id: externalAuthProvider?.id || '',
        issuer: externalAuthProvider?.issuer?.url || '',
        groups: externalAuthProvider?.claim?.mappings?.groups?.claim || 'groups',
        username: externalAuthProvider?.claim?.mappings?.username?.claim || 'email',
        audiences: externalAuthProvider?.issuer?.audiences?.join(', ') || '',
        provider_ca:
          externalAuthProvider?.issuer?.ca?.trim() !== '' ? externalAuthProvider?.issuer?.ca : '',
      }}
      validationSchema={Yup.object({
        id: Yup.string()
          .matches(
            /^[a-z]([-a-z0-9]*[a-z0-9])?$/,
            'Only lowercase alphanumeric characters and hyphens are allowed. Value must start with a letter and end with an alphanumeric.',
          )
          .max(15, 'Must be 15 characters or less')
          .required('Required'),
        issuer: Yup.string()
          .max(255, 'Must be 255 characters or less')
          .required('Required')
          .url('Invalid URL: example https://redhat.com')
          .test('secure-url', 'URL must be https', (value) => validateSecureURL(value)),
        groups: Yup.string()
          .matches(/^[a-zA-Z0-9-]+$/, 'Only alphanumeric characters and hyphens are allowed')
          .required('Required'),
        username: Yup.string()
          .matches(/^[a-zA-Z0-9-]+$/, 'Only alphanumeric characters and hyphens are allowed')
          .required('Required'),
        audiences: Yup.string().required('Required'),
      })}
      onSubmit={async (values) => {
        setSubmitError(undefined);
        setIsPending(true);
        const data: ExternalAuth = buildExternalAuthProvider(values);
        try {
          await submitProvider({
            clusterID,
            values: data,
            externalAuthProviderId: externalAuthProvider?.id,
          });
          onClose();
        } catch (err) {
          setSubmitError(err as any);
        } finally {
          setIsPending(false);
        }
      }}
    >
      {(formik) => (
        <Modal
          id="edit-ext-auth-provider-modal"
          title={
            isEdit
              ? `Edit provider ${externalAuthProvider?.id}`
              : 'Add external authentication provider'
          }
          onClose={onClose}
          isOpen={isOpen}
          variant="medium"
          description={!isEdit && modalDescription}
          actions={[
            <Button isDisabled={isPending} isLoading={isPending} onClick={formik.submitForm}>
              {isEdit ? 'Save' : 'Add'}
            </Button>,
            <Button key="cancel" variant="secondary" onClick={onClose}>
              Cancel
            </Button>,
          ]}
        >
          <Form innerRef={formRef}>
            {!isEdit && <TextField fieldId="id" label="Name" isRequired />}
            <TextField fieldId="issuer" label="Issuer URL" isRequired />
            <TextField
              fieldId="audiences"
              label="Audiences"
              isRequired
              helpText="Use commas to separate multiple audiences"
            />
            <TextField fieldId="groups" label="Groups mapping" isRequired />
            <TextField fieldId="username" label="Username mapping" isRequired />
            <Field
              component={CAUpload}
              onChange={(value: string) => formik.setFieldValue('provider_ca', value)}
              input={{
                name: 'provider_ca',
                value: formik.values.provider_ca,
                onChange: (value: string) => formik.setFieldValue('provider_ca', value),
                onBlur: formik.handleBlur,
              }}
              name="provider_ca"
              label="CA file"
              helpText="PEM encoded certificate bundle to use to validate server certificates for the configured issuer URL."
              certValue={isEdit ? formik.values.provider_ca : ''}
            />
          </Form>
          {submitError && (
            <Stack hasGutter>
              <StackItem>
                <ErrorBox
                  message={isEdit ? 'Error editing provider' : 'Error adding provider'}
                  response={{
                    errorDetails: submitError.response?.data?.details,
                    errorMessage: getErrorMessage({ payload: submitError }),
                    operationID: submitError.response?.data.operation_id,
                  }}
                />
              </StackItem>
            </Stack>
          )}
          {extAuthProviderCliCommand ? (
            <Stack hasGutter>
              <StackItem>
                <br />
                <ExpandableSection
                  toggleText="Advanced CLI command"
                  onToggle={onExternalAuthToggle}
                  isExpanded={isExternalAuthExpanded}
                >
                  <p>
                    The web form is limited and does not support all options. Use the CLI command to
                    configure additional options.
                  </p>
                  <ClipboardCopy
                    textAriaLabel="Copyable ROSA create operator-roles"
                    variant={ClipboardCopyVariant.expansion}
                    isReadOnly
                  >
                    {extAuthProviderCliCommand}
                  </ClipboardCopy>
                </ExpandableSection>
              </StackItem>
            </Stack>
          ) : null}
        </Modal>
      )}
    </Formik>
  );
}
