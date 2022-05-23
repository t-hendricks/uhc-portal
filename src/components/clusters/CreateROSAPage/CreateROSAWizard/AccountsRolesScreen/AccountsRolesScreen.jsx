import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import {
  Form, Grid, GridItem, Text, TextContent, TextVariants, Title,
} from '@patternfly/react-core';
import { Field } from 'redux-form';

import { Link } from 'react-router-dom';
import AWSLogo from '../../../../../styles/images/AWS.png';
import RedHat from '../../../../../styles/images/Logo-RedHat-Hat-Color-RGB.png';
import Prerequisites from '../../../common/Prerequisites/Prerequisites';
import AWSAccountSelection from './AWSAccountSelection';
import ExternalLink from '../../../../common/ExternalLink';
import AssociateAWSAccountModal from './AssociateAWSAccountModal';
import AccountRolesARNsSection from './AccountRolesARNsSection';
import ErrorBox from '../../../../common/ErrorBox';
import links from '../../../../../common/installLinks.mjs';
import { required } from '../../../../../common/validators';
import { normalizedProducts } from '../../../../../common/subscriptionTypes';

function AccountsRolesScreen({
  change,
  touchARNsFields,
  organizationID,
  selectedAWSAccountID,
  selectedInstallerRoleARN,
  openAssociateAWSAccountModal,
  getAWSAccountIDs,
  getAWSAccountIDsResponse,
  getAWSAccountRolesARNs,
  getAWSAccountRolesARNsResponse,
  clearGetAWSAccountRolesARNsResponse,
  clearGetAWSAccountIDsResponse,
}) {
  const longName = 'Red Hat OpenShift Service on AWS (ROSA)';
  const title = `Welcome to ${longName} `;

  const [AWSAccountIDs, setAWSAccountIDs] = useState([]);
  const [awsIDsErrorBox, setAwsIDsErrorBox] = useState(null);

  const hasAWSAccounts = AWSAccountIDs.length > 0;

  // default product and cloud_provider form values
  useEffect(() => {
    change('cloud_provider', 'aws');
    change('product', normalizedProducts.ROSA);
    change('byoc', 'true');
  }, []);

  // default to first available aws account
  useEffect(() => {
    if (!selectedAWSAccountID && hasAWSAccounts) {
      change('associated_aws_id', AWSAccountIDs[0]);
    }
  }, [hasAWSAccounts, selectedAWSAccountID]);

  useEffect(() => {
    if (getAWSAccountIDsResponse.pending) {
      setAwsIDsErrorBox(null);
    } else if (getAWSAccountIDsResponse.fulfilled) {
      const awsIDs = get(getAWSAccountIDsResponse, 'data', []);
      setAWSAccountIDs(awsIDs);
      setAwsIDsErrorBox(null);
    } else if (getAWSAccountIDsResponse.error) {
      // display error
      setAwsIDsErrorBox(<ErrorBox
        message="Error getting associated AWS account id(s)"
        response={getAWSAccountIDsResponse}
      />);
    } else {
      getAWSAccountIDs(organizationID);
    }
  }, [getAWSAccountIDsResponse]);

  const onModalClose = () => {
    clearGetAWSAccountIDsResponse();
    getAWSAccountIDs(organizationID);
  };

  return (
    <Form onSubmit={() => false}>
      <Grid hasGutter className="pf-u-mt-md">
        <GridItem span={9}>
          <Title headingLevel="h2">{title}</Title>
          <br />
          <Text component={TextVariants.p}>
            Create a managed OpenShift cluster on an existing Amazon Web Services (AWS) account.
          </Text>
          <GridItem span={4}>
            <img src={RedHat} className="ocm-c-wizard-intro-image-top" aria-hidden="true" alt="" />
            <img src={AWSLogo} className="ocm-c-wizard-intro-image-bottom" aria-hidden="true" alt="" />
          </GridItem>
        </GridItem>
        <GridItem>
          <Prerequisites initiallyExpanded acknowledgementRequired>
            <TextContent>
              <Text component={TextVariants.p} className="ocm-secondary-text">
                Before continuing, confirm that all prerequisites are met:
              </Text>
              <ul>
                <li>
                  <Text component={TextVariants.p} className="ocm-secondary-text">
                    Completed the
                    {' '}
                    <ExternalLink noIcon href={links.ROSA_AWS_STS_PREREQUISITES}>
                      AWS prerequisites for ROSA with STS
                    </ExternalLink>
                    .
                  </Text>
                </li>
                <li>
                  <Text component={TextVariants.p} className="ocm-secondary-text">
                    Ensure you have available
                    {' '}
                    <ExternalLink noIcon href={links.ROSA_AWS_SERVICE_QUOTAS}>
                      AWS quota.
                    </ExternalLink>
                  </Text>
                </li>
                <li>
                  <Text component={TextVariants.p} className="ocm-secondary-text">
                    Enable the
                    {' '}
                    <ExternalLink noIcon href={links.AWS_CONSOLE}>
                      ROSA service in the AWS Console.
                    </ExternalLink>
                  </Text>
                </li>
                <li>
                  <Text component={TextVariants.p} className="ocm-secondary-text">
                    Install and configure the latest
                    {' '}
                    <ExternalLink noIcon href={links.AWS_CLI}>
                      AWS
                    </ExternalLink>
                    ,
                    {' '}
                    <Link target="_blank" to="/downloads#tool-rosa">
                      ROSA
                    </Link>
                    , and
                    {' '}
                    <Link target="_blank" to="/downloads#tool-oc">
                      oc
                    </Link>
                    {' '}
                    CLIs on your workstation (recommended).
                  </Text>
                </li>
              </ul>
            </TextContent>
          </Prerequisites>
        </GridItem>
        <GridItem span={8}>
          <Title headingLevel="h3">AWS account</Title>
          <Text component={TextVariants.p}>
            Use an AWS account that is linked to your account.
            {' '}
            {!hasAWSAccounts && 'Alternatively, create an AWS account and validate all prerequisites.'}
          </Text>
        </GridItem>
        <GridItem span={4} />
        <GridItem span={5}>
          { awsIDsErrorBox }
          <Field
            component={AWSAccountSelection}
            name="associated_aws_id"
            label="Associated AWS account"
            openAssociateAWSAccountModal={openAssociateAWSAccountModal}
            validate={required}
            extendedHelpText={(
              <>
                A list of associated AWS accounts. You must associate at least
                {' '}
                one account to proceed.
              </>
              )}
            AWSAccountIDs={AWSAccountIDs}
            selectedAWSAccountID={selectedAWSAccountID}
            disabled={getAWSAccountIDsResponse.pending}
          />
        </GridItem>
        <GridItem span={7} />
        {selectedAWSAccountID
        && (
        <AccountRolesARNsSection
          selectedAWSAccountID={selectedAWSAccountID}
          selectedInstallerRoleARN={selectedInstallerRoleARN}
          getAWSAccountRolesARNs={getAWSAccountRolesARNs}
          getAWSAccountRolesARNsResponse={getAWSAccountRolesARNsResponse}
          clearGetAWSAccountRolesARNsResponse={clearGetAWSAccountRolesARNsResponse}
          change={change}
          touchARNsFields={touchARNsFields}
        />
        )}
      </Grid>
      <AssociateAWSAccountModal onClose={onModalClose} />
    </Form>
  );
}

AccountsRolesScreen.propTypes = {
  change: PropTypes.func,
  touchARNsFields: PropTypes.func,
  selectedAWSAccountID: PropTypes.string,
  selectedInstallerRoleARN: PropTypes.string,
  getAWSAccountIDs: PropTypes.func.isRequired,
  getAWSAccountIDsResponse: PropTypes.object.isRequired,
  openAssociateAWSAccountModal: PropTypes.func.isRequired,
  getAWSAccountRolesARNs: PropTypes.func.isRequired,
  getAWSAccountRolesARNsResponse: PropTypes.object.isRequired,
  clearGetAWSAccountIDsResponse: PropTypes.func.isRequired,
  clearGetAWSAccountRolesARNsResponse: PropTypes.func.isRequired,
  organizationID: PropTypes.string.isRequired,
  initialValues: PropTypes.shape({
    associated_aws_id: PropTypes.string,
    installer_role_arn: PropTypes.string,
  }).isRequired,
};

export default AccountsRolesScreen;
