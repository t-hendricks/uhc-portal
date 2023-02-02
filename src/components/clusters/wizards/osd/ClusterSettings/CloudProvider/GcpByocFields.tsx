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
import { Prerequisites } from '~/components/clusters/wizards/common/Prerequisites';
import { FileUploadField } from '~/components/clusters/wizards/form';
import { FieldId } from '~/components/clusters/wizards/osd/constants';

export const GcpByocFields = () => {
  const { ccsCredentialsValidity } = useGlobalState((state) => state.ccsInquiries);

  return (
    <Grid hasGutter>
      <GridItem>
        <Alert variant="info" isInline title="Customer cloud subscription">
          Provision your cluster in a Google Cloud Platform account owned by you or your company to
          leverage your existing relationship and pay Google Cloud Platform directly for public
          cloud costs.
        </Alert>
      </GridItem>

      <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsLg' }}>
        <GridItem>
          <Title headingLevel="h3" className="pf-u-mb-sm">
            GCP service account
          </Title>

          <Prerequisites acknowledgementRequired initiallyExpanded>
            <TextContent>
              <Text component={TextVariants.p} className="ocm-secondary-text">
                Successful cluster provisioning requires that:
              </Text>

              <ul>
                <li>
                  <Text component={TextVariants.p} className="ocm-secondary-text">
                    Your Google Cloud account has the necessary resource quotas and limits to
                    support your desired cluster size according to the{' '}
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

        <Grid>
          <GridItem span={6}>
            <FileUploadField
              validate={(value) => required(value) || validateGCPServiceAccount(value)}
              name={FieldId.GcpServiceAccount}
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
            <p className="pf-u-mt-md">{ccsCredentialsValidity.pending && 'Validating...'}</p>
          </GridItem>
        </Grid>
      </Flex>
    </Grid>
  );
};
