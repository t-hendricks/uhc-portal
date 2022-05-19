import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { Title, Alert, Form } from '@patternfly/react-core';

import CloudProviderSelectionField from '../CloudProviderSelectionField';
import AWSByocFields from './AWSByocFields';
import GCPByocFields from './GCPByocFields';
import { clearCcsCredientialsInquiry } from '../ccsInquiriesActions';

function CloudProviderScreen({
  change,
  ccsCredentialsValidityResponse,
  formValues: {
    cloudProviderId,
    isByoc,
    accountId,
    accessKeyId,
    secretAccessKey,
    gcpServiceAccount,
  },
}) {
  const dispatch = useDispatch();
  const [showValidationAlert, setShowValidationAlert] = React.useState(false);

  React.useEffect(() => {
    dispatch(clearCcsCredientialsInquiry());

    if (!showValidationAlert && ccsCredentialsValidityResponse.fulfilled) {
      setShowValidationAlert(true);
    }

    if (showValidationAlert) {
      setShowValidationAlert(false);
    }
  }, [
    accountId,
    accessKeyId,
    secretAccessKey,
    gcpServiceAccount,
    ccsCredentialsValidityResponse.fulfilled,
  ]);

  return (
    <Form onSubmit={(event) => { event.preventDefault(); return false; }}>
      <Title headingLevel="h3">
        Select a cloud provider
      </Title>
      <Field
        name="cloud_provider"
        component={CloudProviderSelectionField}
        validate={value => (!value ? 'Cloud provider is required.' : undefined)}
        change={change}
      />
      {isByoc && (
        <>
          {cloudProviderId === 'aws'
            ? <AWSByocFields isValidating={ccsCredentialsValidityResponse.pending} />
            : <GCPByocFields isValidating={ccsCredentialsValidityResponse.pending} />}

          {(ccsCredentialsValidityResponse.error || showValidationAlert) && (
            <Alert variant="danger" isInline title={`${cloudProviderId.toUpperCase()} wasn't able to verify your credentials`}>
              Verify that your entered
              {' '}
              {cloudProviderId === 'aws' ? 'access keys match the access keys provided in your AWS account.' : 'service account details are correct'}
            </Alert>
          )}
        </>
      )}
    </Form>
  );
}

CloudProviderScreen.propTypes = {
  formValues: PropTypes.shape({
    isByoc: PropTypes.bool,
    cloudProviderId: PropTypes.string,
    accountId: PropTypes.string,
    accessKeyId: PropTypes.string,
    secretAccessKey: PropTypes.string,
    gcpServiceAccount: PropTypes.string,
  }),
  change: PropTypes.func.isRequired,
  ccsCredentialsValidityResponse: PropTypes.shape({
    pending: PropTypes.bool,
    error: PropTypes.bool,
    cloudProvider: PropTypes.string,
    fulfilled: PropTypes.bool,
  }),
};

export default CloudProviderScreen;
