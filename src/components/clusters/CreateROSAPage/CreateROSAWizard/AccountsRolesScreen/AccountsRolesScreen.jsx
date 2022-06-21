import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import {
  Alert,
  AlertActionLink,
  Form,
  Grid,
  GridItem,
  Text,
  TextContent,
  TextVariants,
  Title,
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
import UserRoleInstructionsModal from './UserRoleInstructionsModal';
import OCMRoleInstructionsModal from './OCMRoleInstructionsModal';
import InstructionCommand from '../../../../common/InstructionCommand';
import { rosaCLICommand } from './AssociateAWSAccountModal/UserRoleScreen';

function AccountsRolesScreen({
  change,
  touchARNsFields,
  organizationID,
  selectedAWSAccountID,
  selectedInstallerRoleARN,
  rosaMaxOSVersion,
  openAssociateAWSAccountModal,
  getAWSAccountIDs,
  getAWSAccountIDsResponse,
  getAWSAccountRolesARNs,
  getAWSAccountRolesARNsResponse,
  getUserRoleResponse,
  clearGetAWSAccountRolesARNsResponse,
  clearGetAWSAccountIDsResponse,
  clearGetUserRoleResponse,
  openUserRoleInstructionsModal,
  openOcmRoleInstructionsModal,
  isUserRoleModalOpen,
  isOCMRoleModalOpen,
  closeModal,
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

  useEffect(() => {
    if (getUserRoleResponse.fulfilled) {
      clearGetUserRoleResponse();
    }
  }, [getUserRoleResponse.fulfilled]);

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
                Before continuing, complete all prerequisites:
              </Text>
              <ul>
                <li>
                  <Text component={TextVariants.p} className="ocm-secondary-text">
                    Review and configure the
                    {' '}
                    <ExternalLink noIcon href={links.ROSA_AWS_STS_PREREQUISITES}>
                      AWS prerequisites for STS with ROSA
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
                    Enable
                    {' '}
                    <ExternalLink noIcon href={links.AWS_CONSOLE}>
                      ROSA in the AWS Console.
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
          rosaMaxOSVersion={rosaMaxOSVersion}
          getAWSAccountRolesARNs={getAWSAccountRolesARNs}
          getAWSAccountRolesARNsResponse={getAWSAccountRolesARNsResponse}
          clearGetAWSAccountRolesARNsResponse={clearGetAWSAccountRolesARNsResponse}
          change={change}
          touchARNsFields={touchARNsFields}
          openOcmRoleInstructionsModal={openOcmRoleInstructionsModal}
        />
        )}
        <GridItem span={9}>
          {getUserRoleResponse.error && (
            <>
              <br />
              <Alert
                className="pf-u-ml-lg"
                variant="danger"
                isInline
                title="A user-role could not be detected"
                actionLinks={(
                  <AlertActionLink
                    onClick={() => openUserRoleInstructionsModal()}
                  >
                    See more user role instructions
                  </AlertActionLink>
              )}
              >
                <TextContent className="ocm-alert-text">
                  <Text component={TextVariants.p} className="pf-u-mb-sm">
                    It is necessary to create and link a user-role with the Red Hat cluster
                    {' '}
                    installer to proceed.
                  </Text>
                  <Text component={TextVariants.p} className="pf-u-mb-sm">
                    To create a user-role, run the following command:
                  </Text>
                  <Text component={TextVariants.p} className="pf-u-mb-sm">
                    <InstructionCommand textAriaLabel="Copyable ROSA create user-role">
                      {rosaCLICommand.userRole}
                    </InstructionCommand>
                  </Text>
                  <Text component={TextVariants.p} className="pf-u-mb-sm ocm-secondary-text">
                    After the role is created and linked successfully, you&apos;ll be able to
                    {' '}
                    continue by clicking the Next button.
                  </Text>
                </TextContent>
              </Alert>
            </>
          )}
        </GridItem>
      </Grid>
      <AssociateAWSAccountModal onClose={onModalClose} />
      <UserRoleInstructionsModal
        closeModal={closeModal}
        isOpen={isUserRoleModalOpen}
        hasAWSAccounts={hasAWSAccounts}
      />
      <OCMRoleInstructionsModal
        closeModal={closeModal}
        isOpen={isOCMRoleModalOpen}
        hasAWSAccounts={hasAWSAccounts}
      />
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
  getUserRoleResponse: PropTypes.object.isRequired,
  clearGetAWSAccountIDsResponse: PropTypes.func.isRequired,
  clearGetAWSAccountRolesARNsResponse: PropTypes.func.isRequired,
  clearGetUserRoleResponse: PropTypes.func.isRequired,
  organizationID: PropTypes.string.isRequired,
  initialValues: PropTypes.shape({
    associated_aws_id: PropTypes.string,
    installer_role_arn: PropTypes.string,
  }).isRequired,
  rosaMaxOSVersion: PropTypes.string,
  openUserRoleInstructionsModal: PropTypes.func,
  openOcmRoleInstructionsModal: PropTypes.func,
  isUserRoleModalOpen: PropTypes.bool,
  isOCMRoleModalOpen: PropTypes.bool,
  closeModal: PropTypes.func,
};

export default AccountsRolesScreen;
