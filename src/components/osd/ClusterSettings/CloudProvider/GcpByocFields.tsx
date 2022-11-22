import React from 'react';

import {
  Alert,
  GridItem,
  Title,
  Text,
  TextVariants,
  TextContent,
  Flex,
  Grid,
} from '@patternfly/react-core';

import { useGlobalState } from '~/redux/hooks/useGlobalState';
import links from '~/common/installLinks.mjs';
import { required, validateGCPServiceAccount } from '~/common/validators';
import ExternalLink from '~/components/common/ExternalLink';
import { Prerequisites } from '../../common/Prerequisites';
import { FileUploadField } from '../../common/form';

export const GcpByocFields = () => {
  const { ccsCredentialsValidity } = useGlobalState((state) => state.ccsInquiries);

  return (
    <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsLg' }}>
      <GridItem>
        <Alert variant="info" isInline title="Customer cloud subscription">
          Provision your cluster in a Google Cloud Platform account owned by you or your company to
          leverage your existing relationship and pay Google Cloud Platform directly for public
          cloud costs.
        </Alert>
      </GridItem>
      <GridItem>
        <Title headingLevel="h3">GCP service account</Title>
      </GridItem>
      <GridItem>
        <Prerequisites acknowledgementRequired initiallyExpanded>
          <TextContent>
            <Text component={TextVariants.p} className="ocm-secondary-text">
              Successful cluster provisioning requires that:
            </Text>
            <ul>
              <li>
                <Text component={TextVariants.p} className="ocm-secondary-text">
                  Your Google Cloud account has the necessary resource quotas and limits to support
                  your desired cluster size according to the{' '}
                  <ExternalLink noIcon href={links.OSD_CCS_GCP_LIMITS}>
                    cluster resource requirements
                  </ExternalLink>
                </Text>
              </li>
              <li>
                <Text component={TextVariants.p} className="ocm-secondary-text">
                  An IAM Service account called osd-ccs-admin exists with the following roles
                  attached:
                </Text>
                <ul>
                  <li>
                    <Text component={TextVariants.p} className="ocm-secondary-text">
                      DNS Administrator
                    </Text>
                  </li>
                  <li>
                    <Text component={TextVariants.p} className="ocm-secondary-text">
                      Organization Policy Viewer
                    </Text>
                  </li>
                  <li>
                    <Text component={TextVariants.p} className="ocm-secondary-text">
                      Owner
                    </Text>
                  </li>
                  <li>
                    <Text component={TextVariants.p} className="ocm-secondary-text">
                      Project IAM Admin
                    </Text>
                  </li>
                  <li>
                    <Text component={TextVariants.p} className="ocm-secondary-text">
                      Service Management Administrator
                    </Text>
                  </li>
                  <li>
                    <Text component={TextVariants.p} className="ocm-secondary-text">
                      Service Usage Admin
                    </Text>
                  </li>
                  <li>
                    <Text component={TextVariants.p} className="ocm-secondary-text">
                      Storage Admin
                    </Text>
                  </li>
                </ul>
              </li>
            </ul>
            <Text component={TextVariants.p} className="ocm-secondary-text">
              Production Support from GCP is also recommended. To prevent potential conflicts, we
              recommend that you have no other resources provisioned in the project prior to
              provisioning OpenShift Dedicated. For more guidance, see the{' '}
              <ExternalLink noIcon href={links.OSD_CCS_GCP}>
                Customer Cloud Subscription requirements
              </ExternalLink>
              .
            </Text>
          </TextContent>
        </Prerequisites>
      </GridItem>
      <Grid hasGutter md={6}>
        <GridItem>
          <FileUploadField
            validate={(value) => required(value) || validateGCPServiceAccount(value)}
            name="gcp_service_account"
            label="Service account JSON"
            helperText="Upload a JSON file or type to add"
            tooltip={
              <>
                <p>
                  To create a service account JSON file, create a key for your service account,
                  export it to a file and upload it to this field.
                </p>
                <ExternalLink href="https://cloud.google.com/iam/docs/creating-managing-service-account-keys#creating_service_account_keys">
                  Learn how to create service account keys
                </ExternalLink>
              </>
            }
          />
        </GridItem>
        <GridItem>{ccsCredentialsValidity.pending && 'Validating...'}</GridItem>
      </Grid>
    </Flex>
  );
};
