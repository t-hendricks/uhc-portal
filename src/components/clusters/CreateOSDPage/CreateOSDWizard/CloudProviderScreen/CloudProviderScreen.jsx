import React from 'react';
import PropTypes from 'prop-types';
import { Title, Alert, Form } from '@patternfly/react-core';
import { Field } from 'redux-form';

import CloudProviderSelectionField from '../CloudProviderSelectionField';
import AWSByocFields from './AWSByocFields';
import GCPByocFields from './GCPByocFields';

function CloudProviderScreen({
  isByoc,
  cloudProviderID,
  change,
  ccsCredentialsValidityResponse,
}) {
  return (
    <Form onSubmit={(event) => { event.preventDefault(); return false; }}>
      <Title headingLevel="h3">
        Select a cloud provider
      </Title>
      <Field
        name="cloud_provider"
        component={CloudProviderSelectionField}
        validate={value => !value && 'Cloud provider is required.'}
        change={change}
      />
      {isByoc && cloudProviderID && (
        cloudProviderID === 'aws'
          ? <AWSByocFields isValidating={ccsCredentialsValidityResponse.pending} />
          : <GCPByocFields isValidating={ccsCredentialsValidityResponse.pending} />
      )}
      {isByoc
        && ccsCredentialsValidityResponse.error
        && ccsCredentialsValidityResponse.cloudProvider === cloudProviderID
        && (
          <Alert variant="danger" isInline title={`${cloudProviderID.toUpperCase()} wasn't able to verify your credentials`}>
            Verify that your entered
            {' '}
            {cloudProviderID === 'aws' ? 'access keys match the access keys provided in your AWS account.' : 'service account details are correct'}
          </Alert>
        )}
    </Form>
  );
}

CloudProviderScreen.propTypes = {
  isByoc: PropTypes.bool,
  cloudProviderID: PropTypes.string,
  change: PropTypes.func.isRequired,
  ccsCredentialsValidityResponse: PropTypes.shape({
    pending: PropTypes.bool,
    error: PropTypes.bool,
    cloudProvider: PropTypes.string,
  }),
};

export default CloudProviderScreen;
