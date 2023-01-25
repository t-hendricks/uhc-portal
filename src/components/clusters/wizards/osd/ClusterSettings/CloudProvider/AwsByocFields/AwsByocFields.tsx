import React from 'react';

import {
  Alert,
  GridItem,
  TextContent,
  Text,
  Title,
  TextVariants,
  Grid,
} from '@patternfly/react-core';

import links from '~/common/installLinks.mjs';
import ExternalLink from '~/components/common/ExternalLink';
import { Prerequisites } from '~/components/clusters/wizards/common/Prerequisites';
import { AwsAccountDetails } from './AwsAccountDetails';

export const AwsByocFields = () => (
  <Grid hasGutter>
    <GridItem>
      <Alert variant="info" isInline title="Customer cloud subscription">
        Provision your cluster in an AWS account owned by you or your company to leverage your
        existing relationship and pay AWS directly for public cloud costs.
      </Alert>
    </GridItem>

    <GridItem>
      <Title headingLevel="h3" className="pf-u-mb-sm">
        AWS account details
      </Title>

      <Prerequisites acknowledgementRequired initiallyExpanded>
        <TextContent>
          <Text component={TextVariants.p} className="ocm-secondary-text">
            Successful cluster provisioning requires that:
          </Text>

          <ul>
            <li>
              <Text component={TextVariants.p} className="ocm-secondary-text">
                Your AWS account has the necessary limits to support your desired cluster size
                according to the{' '}
                <ExternalLink noIcon href={links.OSD_CCS_AWS_LIMITS}>
                  cluster resource requirements
                </ExternalLink>
                .
              </Text>
            </li>
            <li>
              <Text component={TextVariants.p} className="ocm-secondary-text">
                An IAM user called <b>osdCcsAdmin</b> exists with the AdministratorAccess policy.
              </Text>
            </li>
            <li>
              <Text component={TextVariants.p} className="ocm-secondary-text">
                An Organization service control policy (SCP) is set up according to the requirements
                for Customer Cloud Subscriptions.
              </Text>
            </li>
          </ul>

          <Text component={TextVariants.p} className="ocm-secondary-text">
            Business Support for AWS is also recommended. For more guidance, see the{' '}
            <ExternalLink href={links.OSD_CCS_AWS_CUSTOMER_REQ}>
              Customer Cloud Subscription requirements
            </ExternalLink>
            .
          </Text>
        </TextContent>
      </Prerequisites>
    </GridItem>
    <AwsAccountDetails />
  </Grid>
);
