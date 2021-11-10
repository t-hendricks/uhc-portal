import React from 'react';
import PropTypes from 'prop-types';
import {
  Title,
  Form,
  Alert,
} from '@patternfly/react-core';
import { Field } from 'redux-form';

import { required } from '../../../../../common/validators';

import CloudProviderSelectionField from '../CloudProviderSelectionField';
import AWSByocFields from './AWSByocFields';
import GCPByocFields from './GCPByocFields';

function ClusterSettingsScreen({ isByoc, cloudProviderID, ccsCredentialsValidityResponse }) {
  return (
    <Form onSubmit={(event) => { event.preventDefault(); return false; }}>
      <Title headingLevel="h3">
        Select a cloud provider
      </Title>
      <Field
        name="cloud_provider"
        component={CloudProviderSelectionField}
        validate={required}
      />
      { isByoc && cloudProviderID && (
        cloudProviderID === 'aws' ? <AWSByocFields isValidating={ccsCredentialsValidityResponse.pending} /> : <GCPByocFields isValidating={ccsCredentialsValidityResponse.pending} />
      )}
      { isByoc && ccsCredentialsValidityResponse.error && (
        <Alert variant="danger" isInline title={`${cloudProviderID.toUpperCase()} wasn't able to verify your credentials`}>
          Verify that your entered
          {' '}
          {cloudProviderID === 'aws' ? 'access keys match the access keys provided in your AWS account.' : 'service account details are correct'}
        </Alert>
      )}
    </Form>
  );
}

ClusterSettingsScreen.propTypes = {
  isByoc: PropTypes.bool,
  cloudProviderID: PropTypes.string,
  ccsCredentialsValidityResponse: PropTypes.shape({
    pending: PropTypes.bool,
    error: PropTypes.bool,
  }),
};

export default ClusterSettingsScreen;
