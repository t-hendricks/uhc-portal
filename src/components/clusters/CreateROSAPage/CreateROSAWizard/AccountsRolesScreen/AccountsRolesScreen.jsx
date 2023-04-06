import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import {
  Alert,
  AlertActionLink,
  Button,
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

import AWSLogo from '~/styles/images/AWS.png';
import RedHat from '~/styles/images/Logo-RedHat-Hat-Color-RGB.png';
import { required } from '~/common/validators';
import { normalizedProducts } from '~/common/subscriptionTypes';
import { trackEvents } from '~/common/analytics';
import useAnalytics from '~/hooks/useAnalytics';
import ErrorBox from '~/components/common/ErrorBox';
import InstructionCommand from '~/components/common/InstructionCommand';
import { loadOfflineToken } from '~/components/tokens/TokenUtils';

import { RosaCliCommand } from './constants/cliCommands';
import AWSAccountSelection from './AWSAccountSelection';
import AccountRolesARNsSection from './AccountRolesARNsSection';
import UserRoleInstructionsModal from './UserRoleInstructionsModal';
import OCMRoleInstructionsModal from './OCMRoleInstructionsModal';
import { AssociateAwsAccountModal } from './AssociateAWSAccountModal';
import { productName } from '../CreateRosaGetStarted/CreateRosaGetStarted';

export const isUserRoleForSelectedAWSAccount = (users, awsAcctId) =>
  users.some((user) => user.aws_id === awsAcctId);

export const getUserRoleForSelectedAWSAccount = (users, awsAcctId) =>
  users.find((user) => user.aws_id === awsAcctId);

function AccountsRolesScreen({
  touch,
  change,
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
  isHypershiftSelected,
  closeModal,
  offlineToken,
  setOfflineToken,
}) {
  const [AWSAccountIDs, setAWSAccountIDs] = useState([]);
  const [noUserForSelectedAWSAcct, setNoUserForSelectedAWSAcct] = useState(false);
  const [awsIDsErrorBox, setAwsIDsErrorBox] = useState(null);
  const [isAssocAwsAccountModalOpen, setIsAssocAwsAccountModalOpen] = useState(false);
  const [refreshButtonClicked, setRefreshButtonClicked] = useState(false);
  const title = 'Welcome to Red Hat OpenShift Service on AWS (ROSA)';
  const hasAWSAccounts = AWSAccountIDs.length > 0;
  const track = useAnalytics();

  const resetAWSAccountFields = () => {
    // clear certain responses; causes refetch of AWS acct info.
    clearGetAWSAccountIDsResponse();
    clearGetAWSAccountRolesARNsResponse();
    clearGetUserRoleResponse();
  };

  const resetUserRoleFields = () => {
    setNoUserForSelectedAWSAcct(false);
    clearGetUserRoleResponse();
  };

  // default product and cloud_provider form values
  useEffect(() => {
    // default product and cloud_provider form values
    change('cloud_provider', 'aws');
    change('product', normalizedProducts.ROSA);
    change('byoc', 'true');
    resetAWSAccountFields();

    // Load token async as soon as this wizard step is opened (unless it's been loaded before, retrieve from redux store)
    // Initially it will error out and call onTokenError
    // This will call doOffline which creates an iframe that goes out to the token API and redirects back to this page
    // Inside the iframe, this same wizard step is loaded, and the loadOfflineToken function is called again
    // This time it will succeed, and the iframe child sends the token to the parent
    // Once the parent receives the token, it executes a function callback to pass the token into local state
    if (!offlineToken) {
      loadOfflineToken((tokenOrError, errorReason) => {
        setOfflineToken(errorReason || tokenOrError);
      }, window.location.origin);
    }
  }, []);

  useEffect(() => {
    if (getUserRoleResponse.fulfilled && selectedAWSAccountID) {
      const found = isUserRoleForSelectedAWSAccount(getUserRoleResponse.data, selectedAWSAccountID);
      setNoUserForSelectedAWSAcct(!found);
      clearGetUserRoleResponse();
    }
  }, [getUserRoleResponse.fulfilled, selectedAWSAccountID]);

  // if aws acct ids default to first available aws account
  useEffect(() => {
    if (hasAWSAccounts && !selectedAWSAccountID) {
      change('associated_aws_id', AWSAccountIDs[0]);
    }
  }, [hasAWSAccounts, selectedAWSAccountID]);

  useEffect(() => {
    if (getAWSAccountIDsResponse.pending) {
      setAwsIDsErrorBox(null);
    } else if (getAWSAccountIDsResponse.fulfilled) {
      const awsIDs = get(getAWSAccountIDsResponse, 'data', []);
      setAWSAccountIDs(awsIDs);
      if (!awsIDs.includes(selectedAWSAccountID)) {
        change('associated_aws_id', '');
      }
      setAwsIDsErrorBox(null);
    } else if (getAWSAccountIDsResponse.error) {
      // display error
      setAwsIDsErrorBox(
        <ErrorBox
          message="Error getting associated AWS account id(s)"
          response={getAWSAccountIDsResponse}
        />,
      );
    } else {
      getAWSAccountIDs(organizationID);
    }
  }, [getAWSAccountIDsResponse]);

  useEffect(() => {
    if (getUserRoleResponse?.error || noUserForSelectedAWSAcct) {
      track(trackEvents.MissingUserRole);
    }
  }, [getUserRoleResponse?.error, noUserForSelectedAWSAcct]);

  const onAssociateAwsAccountModalClose = () => {
    setIsAssocAwsAccountModalOpen(false);
    clearGetAWSAccountIDsResponse();
  };

  return (
    <Form onSubmit={() => false}>
      {/* these images use fixed positioning */}
      <img src={RedHat} className="ocm-c-wizard-intro-image-top" aria-hidden="true" alt="" />
      <img src={AWSLogo} className="ocm-c-wizard-intro-image-bottom" aria-hidden="true" alt="" />
      <Grid hasGutter className="pf-u-mt-md">
        <GridItem span={12}>
          <Title headingLevel="h2">{title}</Title>
        </GridItem>
        <GridItem span={12}>
          <Text component={TextVariants.p}>
            Create a managed OpenShift cluster on an existing Amazon Web Services (AWS) account.
          </Text>
        </GridItem>
        <GridItem span={9}>
          <Title headingLevel="h3">Prerequisites</Title>
          <Text component={TextVariants.p}>
            To use the web interface to create a ROSA cluster you will need to have already
            completed the perquisite steps to prepare your AWS account on the{' '}
            <Link to="getstarted">{`Get started with a ${productName} (ROSA) page.`}</Link>
          </Text>
        </GridItem>
        <GridItem span={8}>
          <Title headingLevel="h3">AWS infrastructure account</Title>
          <Text component={TextVariants.p}>
            Select an AWS account that is associated with your Red Hat account or associate a new
            account. This account will contain the ROSA infrastructure.
          </Text>
        </GridItem>
        <GridItem span={4} />
        <GridItem sm={12} md={7}>
          {awsIDsErrorBox}
          <Field
            component={AWSAccountSelection}
            name="associated_aws_id"
            label="Associated AWS infrastructure account"
            launchAssocAWSAcctModal={() => {
              openAssociateAWSAccountModal();
              setIsAssocAwsAccountModalOpen(true);
            }}
            onRefresh={() => {
              setRefreshButtonClicked(true);
              resetAWSAccountFields();
            }}
            validate={!getAWSAccountIDsResponse.fulfilled ? undefined : required}
            extendedHelpText={
              <>
                A list of associated AWS infrastructure accounts. You must associate at least one
                account to proceed.
              </>
            }
            AWSAccountIDs={AWSAccountIDs}
            selectedAWSAccountID={selectedAWSAccountID}
            isLoading={refreshButtonClicked && getAWSAccountIDsResponse.pending}
            isDisabled={getAWSAccountIDsResponse.pending}
          />
          <Button
            variant="secondary"
            className="pf-u-mt-md"
            onClick={() => {
              track(trackEvents.AssociateAWS);
              openAssociateAWSAccountModal();
              setIsAssocAwsAccountModalOpen(true);
            }}
          >
            How to associate a new account
          </Button>
        </GridItem>
        <GridItem span={7} />
        {selectedAWSAccountID && hasAWSAccounts && (
          <AccountRolesARNsSection
            touch={touch}
            change={change}
            selectedAWSAccountID={selectedAWSAccountID}
            selectedInstallerRoleARN={selectedInstallerRoleARN}
            rosaMaxOSVersion={rosaMaxOSVersion}
            getAWSAccountRolesARNs={getAWSAccountRolesARNs}
            getAWSAccountRolesARNsResponse={getAWSAccountRolesARNsResponse}
            clearGetAWSAccountRolesARNsResponse={clearGetAWSAccountRolesARNsResponse}
            isHypershiftSelected={isHypershiftSelected}
            onAccountChanged={resetUserRoleFields}
            openOcmRoleInstructionsModal={openOcmRoleInstructionsModal}
          />
        )}
        <GridItem span={9}>
          {(getUserRoleResponse?.error || noUserForSelectedAWSAcct) && (
            <>
              <br />
              <Alert
                className="pf-u-ml-lg"
                variant="danger"
                isInline
                title="A user-role could not be detected"
                actionLinks={
                  <AlertActionLink onClick={() => openUserRoleInstructionsModal()}>
                    See more user role instructions
                  </AlertActionLink>
                }
              >
                <TextContent className="ocm-alert-text">
                  <Text component={TextVariants.p} className="pf-u-mb-sm">
                    It is necessary to create and link a user-role with the Red Hat cluster{' '}
                    installer to proceed.
                  </Text>
                  <Text component={TextVariants.p} className="pf-u-mb-sm">
                    To create a user-role, run the following command:
                  </Text>
                  <Text component={TextVariants.p} className="pf-u-mb-sm">
                    <InstructionCommand textAriaLabel="Copyable ROSA create user-role">
                      {RosaCliCommand.UserRole}
                    </InstructionCommand>
                  </Text>
                  <Text component={TextVariants.p} className="pf-u-mb-sm ocm-secondary-text">
                    After the role is created and linked successfully, you&apos;ll be able to{' '}
                    continue by clicking the Next button.
                  </Text>
                </TextContent>
              </Alert>
            </>
          )}
        </GridItem>
      </Grid>

      <AssociateAwsAccountModal
        isOpen={isAssocAwsAccountModalOpen}
        onClose={onAssociateAwsAccountModalClose}
      />

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
  touch: PropTypes.func,
  change: PropTypes.func,
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
  isHypershiftSelected: PropTypes.bool,
  closeModal: PropTypes.func,
  offlineToken: PropTypes.string,
  setOfflineToken: PropTypes.func,
};

export default AccountsRolesScreen;
