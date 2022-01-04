import PropTypes from 'prop-types';
import React from 'react';
import {
  Alert, GridItem, ExpandableSection, TextContent, Title,
} from '@patternfly/react-core';
import { Field } from 'redux-form';

import { required, validateGCPServiceAccount } from '../../../../../common/validators';

import ExternalLink from '../../../../common/ExternalLink';
import ReduxFileUpload from '../../../../common/ReduxFormComponents/ReduxFileUpload';

function GCPByocFields({ isValidating }) {
  return (
    <>
      <GridItem>
        <Alert variant="info" isInline title="Customer cloud subscription">
          Provision your cluster in a Google Cloud Platform account owned by you or your company
          to leverage your existing relationship and
          pay Google Cloud Platform directly for public cloud costs.
        </Alert>
      </GridItem>
      <GridItem>
        <Title headingLevel="h3">GCP service account</Title>
      </GridItem>
      <GridItem>
        <ExpandableSection toggleText="Prerequisites">
          <TextContent>
            Successful cluster provisioning requires that:
            <ul>
              <li>
                Your Google Cloud account has the necessary resource quotas and
                limits to support your desired cluster size according to the
                {' '}
                <ExternalLink noIcon href="https://www.openshift.com/dedicated/ccs">cluster resource requirements</ExternalLink>
              </li>
              <li>
                An IAM Service account called osd-ccs-admin exists
                with the following roles attached:
                <ul>
                  <li>DNS Administrator</li>
                  <li>Organization Policy Viewer</li>
                  <li>Owner</li>
                  <li>Project IAM Admin</li>
                  <li>Service Management Administrator</li>
                  <li>Service Usage Admin</li>
                  <li>Storage Admin</li>
                </ul>
              </li>
            </ul>
            Production Support from GCP is also recommended.
            To prevent potential conflicts, we recommend that you have no other resources
            provisioned in the project prior to provisioning OpenShift Dedicated.
            For more guidance, see the
            {' '}
            <ExternalLink noIcon href="https://www.openshift.com/dedicated/ccs">customer cloud subscription requirements.</ExternalLink>
          </TextContent>
        </ExpandableSection>
      </GridItem>
      <GridItem md={5}>
        <Field
          component={ReduxFileUpload}
          validate={[required, validateGCPServiceAccount]}
          extendedHelpText={(
            <>
              <p>
                To create a service account JSON file, create a key for your service account,
                export it to a file and upload it to this field.
              </p>
              <ExternalLink href="https://cloud.google.com/iam/docs/creating-managing-service-account-keys#creating_service_account_keys">Learn how to create service account keys</ExternalLink>
            </>
          )}
          name="gcp_service_account"
          isRequired
          label="Service account JSON"
          helpText="Upload a JSON file or type to add"
          className="pf-c-form-control"
        />
      </GridItem>
      <GridItem>
        {isValidating && (
          <>
            Validating...
          </>
        )}
      </GridItem>
    </>
  );
}

GCPByocFields.propTypes = {
  isValidating: PropTypes.bool,
};

export default GCPByocFields;
