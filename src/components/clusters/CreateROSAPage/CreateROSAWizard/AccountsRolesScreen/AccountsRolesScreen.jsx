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

import AWSLogo from '../../../../../styles/images/AWS.png';
import RedHat from '../../../../../styles/images/Logo-RedHat-Hat-Color-RGB.png';
import AWSAccountSelection from './AWSAccountSelection';
import AccountRolesARNsSection from './AccountRolesARNsSection';
import ErrorBox from '../../../../common/ErrorBox';
import { required } from '../../../../../common/validators';
import { normalizedProducts } from '../../../../../common/subscriptionTypes';
import UserRoleInstructionsModal from './UserRoleInstructionsModal';
import OCMRoleInstructionsModal from './OCMRoleInstructionsModal';
import InstructionCommand from '../../../../common/InstructionCommand';
import { AssociateAwsAccountModal } from './AssociateAWSAccountModal';
import { RosaCliCommand } from './constants/cliCommands';
import { trackEvents } from '~/common/analytics';
import useAnalytics from '~/hooks/useAnalytics';
import { loadOfflineToken, doOffline } from '~/components/tokens/TokenUtils';

export const isUserRoleForSelectedAWSAccount = (users, awsAcctId) =>
  users.some((user) => user.aws_id === awsAcctId);

export const getUserRoleForSelectedAWSAccount = (users, awsAcctId) =>
  users.find((user) => user.aws_id === awsAcctId);

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
    if (!offlineToken || offlineToken instanceof Error) {
      loadOfflineToken(onTokenError);
    }
  }, []);

  useEffect(() => {
    if (getUserRoleResponse.fulfilled && selectedAWSAccountID) {
      const found = isUserRoleForSelectedAWSAccount(getUserRoleResponse.data, selectedAWSAccountID);
      setNoUserForSelectedAWSAcct(!found);
      clearGetUserRoleResponse();
    }
  }, [getUserRoleResponse.fulfilled, selectedAWSAccountID]);

  // if no aws acct ids then clear selectedAWSAccountID, else default to first available aws account
  useEffect(() => {
    if (!hasAWSAccounts) {
      change('associated_aws_id', '');
    } else if (!selectedAWSAccountID) {
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

  const onAssociateAwsAccountModalClose = () => {
    setIsAssocAwsAccountModalOpen(false);
    clearGetAWSAccountIDsResponse();
  };

  const onTokenError = (reason) => {
    if (reason === 'not available') {
      doOffline((token) => {
        setOfflineToken(token);
      });
    } else {
      setOfflineToken(reason);
    }
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
            <img
              src={AWSLogo}
              className="ocm-c-wizard-intro-image-bottom"
              aria-hidden="true"
              alt=""
            />
          </GridItem>
        </GridItem>
        <GridItem span={8}>
          <Title headingLevel="h3">AWS account</Title>
          <Text component={TextVariants.p}>
            Select an AWS account that is associated with your Red Hat account, or{' '}
            <Button
              variant="link"
              isInline
              onClick={() => {
                track(trackEvents.AssociateAWS);
                openAssociateAWSAccountModal();
                setIsAssocAwsAccountModalOpen(true);
              }}
            >
              associate an AWS account
            </Button>
            .
          </Text>
        </GridItem>
        <GridItem span={4} />
        <GridItem span={5}>
          {awsIDsErrorBox}
          <Field
            component={AWSAccountSelection}
            name="associated_aws_id"
            label="Associated AWS accounts"
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
                A list of associated AWS accounts. You must associate at least one account to
                proceed.
              </>
            }
            AWSAccountIDs={AWSAccountIDs}
            selectedAWSAccountID={selectedAWSAccountID}
            isLoading={refreshButtonClicked && getAWSAccountIDsResponse.pending}
            isDisabled={getAWSAccountIDsResponse.pending}
          />
        </GridItem>
        <GridItem span={7} />
        {selectedAWSAccountID && hasAWSAccounts && (
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
  offlineToken: PropTypes.string,
  setOfflineToken: PropTypes.func,
};

export default AccountsRolesScreen;
