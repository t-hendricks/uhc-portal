import React from 'react';
import {
  Alert, GridItem, ExpandableSection, TextContent, Title,
} from '@patternfly/react-core';
import { Field } from 'redux-form';

import { required, validateGCPServiceAccount } from '../../../../../common/validators';

import ExternalLink from '../../../../common/ExternalLink';
import ReduxFileUpload from '../../../../common/ReduxFormComponents/ReduxFileUpload';

function GCPByocFields() {
  return (
    <>
      <GridItem span={12}>
        <Alert variant="info" isInline title="Customer cloud subscription">
          Provision your cluster in a Google Cloud Platform account owned by you or your company
          to leverage your existing relationship and
          pay Google Cloud Platform directly for public cloud costs.
        </Alert>
      </GridItem>
      <GridItem span={12}>
        <Title headingLevel="h3">GCP service account</Title>
      </GridItem>
      <GridItem span={12}>
        <ExpandableSection toggleText="Prerequisites">
          <TextContent>
            <p>
              In order to create a Customer Cloud Subscription cluster, you must have a Service
              Account in GCP named
              {' '}
              <code>osd-ccs-admin</code>
              {' '}
              that meets
              {' '}
              <ExternalLink href="https://www.openshift.com/dedicated/ccs">these requirements.</ExternalLink>
              {' '}
              Create a key for that service account, export to a file named
              {' '}
              <code>osServiceAccount.json</code>
              {' '}
              and add it here.
            </p>
          </TextContent>
        </ExpandableSection>
      </GridItem>
      <GridItem span={4}>
        <Field
          component={ReduxFileUpload}
          validate={[required, validateGCPServiceAccount]}
          name="gcp_service_account"
          isRequired
          label="Service account JSON"
          helpText="Upload a JSON file or type to add"
        />
      </GridItem>
    </>
  );
}

export default GCPByocFields;
