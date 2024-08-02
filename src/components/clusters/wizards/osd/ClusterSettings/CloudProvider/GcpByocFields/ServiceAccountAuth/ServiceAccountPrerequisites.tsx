import React from 'react';

import { Text, TextContent, TextVariants } from '@patternfly/react-core';

import links from '~/common/installLinks.mjs';
import ExternalLink from '~/components/common/ExternalLink';

const ServiceAccountPrerequisites = () => (
  <div>
    <TextContent>
      <Text component={TextVariants.p} className="ocm-secondary-text">
        Successful cluster provisioning requires that:
      </Text>

      <ul>
        <li>
          <Text component={TextVariants.p} className="ocm-secondary-text">
            Your Google Cloud account has the necessary resource quotas and limits to support your
            desired cluster size according to the{' '}
            <ExternalLink noIcon href={links.OSD_CCS_GCP_LIMITS}>
              cluster resource requirements
            </ExternalLink>
          </Text>
        </li>
        <li>
          <Text component={TextVariants.p} className="ocm-secondary-text">
            An IAM Service account called osd-ccs-admin exists with the following roles attached:
          </Text>
          <ul>
            <li>
              <Text component={TextVariants.p} className="ocm-secondary-text">
                Compute Admin
              </Text>
            </li>
            <li>
              <Text component={TextVariants.p} className="ocm-secondary-text">
                DNS Administrator
              </Text>
            </li>
            <li>
              <Text component={TextVariants.p} className="ocm-secondary-text">
                Security Admin
              </Text>
            </li>
            <li>
              <Text component={TextVariants.p} className="ocm-secondary-text">
                Service Account Admin
              </Text>
            </li>
            <li>
              <Text component={TextVariants.p} className="ocm-secondary-text">
                Service Account Key Admin
              </Text>
            </li>
            <li>
              <Text component={TextVariants.p} className="ocm-secondary-text">
                Service Account User
              </Text>
            </li>
            <li>
              <Text component={TextVariants.p} className="ocm-secondary-text">
                Organization Policy Viewer
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
            <li>
              <Text component={TextVariants.p} className="ocm-secondary-text">
                Compute Load Balancer Admin
              </Text>
            </li>
            <li>
              <Text component={TextVariants.p} className="ocm-secondary-text">
                Role Viewer
              </Text>
            </li>
            <li>
              <Text component={TextVariants.p} className="ocm-secondary-text">
                Role Administrator
              </Text>
            </li>
          </ul>
        </li>
      </ul>

      <Text component={TextVariants.p} className="ocm-secondary-text">
        Enhanced Support from GCP is also recommended. To prevent potential conflicts, we recommend
        that you have no other resources provisioned in the project prior to provisioning OpenShift
        Dedicated. For more guidance, see the{' '}
        <ExternalLink noIcon href={links.OSD_CCS_GCP}>
          Customer Cloud Subscription requirements
        </ExternalLink>
        .
      </Text>
    </TextContent>
  </div>
);

export { ServiceAccountPrerequisites };
