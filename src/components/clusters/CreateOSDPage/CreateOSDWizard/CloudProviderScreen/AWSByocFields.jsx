import PropTypes from 'prop-types';
import React from 'react';

import {
  Alert,
  GridItem,
  Text,
  TextVariants,
  TextContent,
  Title,
} from '@patternfly/react-core';

import links from '../../../../../common/installLinks.mjs';
import ExternalLink from '../../../../common/ExternalLink';
import AWSAccountDetailsSection from '../../CreateOSDForm/FormSections/AWSAccountDetailsSection';
import Prerequisites from '../../../common/Prerequisites/Prerequisites';

function AWSByocFields({ isValidating }) {
  return (
    <>
      <GridItem>
        <Alert variant="info" isInline title="Customer cloud subscription">
          Provision your cluster in an AWS account owned by you or your company
          to leverage your existing relationship and pay AWS directly for public cloud costs.
        </Alert>
      </GridItem>
      <GridItem>
        <Title headingLevel="h3">AWS account details</Title>
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
                  Your AWS account has the necessary limits to support your desired cluster size
                  according to the
                  {' '}
                  <ExternalLink noIcon href={links.OSD_CCS_AWS_LIMITS}>
                    cluster resource requirements
                  </ExternalLink>
                  .
                </Text>
              </li>
              <li>
                <Text component={TextVariants.p} className="ocm-secondary-text">
                  An IAM user called
                  {' '}
                  <b>osdCcsAdmin</b>
                  {' '}
                  exists with the AdministratorAccess policy.
                </Text>
              </li>
              <li>
                <Text component={TextVariants.p} className="ocm-secondary-text">
                  An Organization service control policy (SCP) is set up according
                  to the requirements for Customer Cloud Subscriptions.
                </Text>
              </li>
            </ul>
            <Text component={TextVariants.p} className="ocm-secondary-text">
              Business Support for AWS is also recommended.
              For more guidance, see the
              {' '}
              <ExternalLink href={links.OSD_CCS_AWS_CUSTOMER_REQ}>
                Customer Cloud Subscription requirements
              </ExternalLink>
              .
            </Text>
          </TextContent>
        </Prerequisites>
      </GridItem>
      <AWSAccountDetailsSection isWizard isValidating={isValidating} />
    </>
  );
}

AWSByocFields.propTypes = {
  isValidating: PropTypes.bool,
};

export default AWSByocFields;
