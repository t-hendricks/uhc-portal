import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import { Button, Form, Grid, GridItem, Text, TextVariants, Title } from '@patternfly/react-core';
import { Field } from 'redux-form';

import { required } from '~/common/validators';
import { normalizedProducts } from '~/common/subscriptionTypes';
import { trackEvents } from '~/common/analytics';
import useAnalytics from '~/hooks/useAnalytics';
import ErrorBox from '~/components/common/ErrorBox';
import { loadOfflineToken } from '~/components/tokens/TokenUtils';

import AccountRolesARNsSection from './AccountRolesARNsSection';
import { AssociateAwsAccountModal } from './AssociateAWSAccountModal';
import { AwsRoleErrorAlert } from './AwsRoleErrorAlert';
import AWSAccountSelection from './AWSAccountSelection';
import AWSBillingAccount from './AWSBillingAccount';

export const isUserRoleForSelectedAWSAccount = (users, awsAcctId) =>
  users.some((user) => user.aws_id === awsAcctId);

export const getUserRoleForSelectedAWSAccount = (users, awsAcctId) =>
  users.find((user) => user.aws_id === awsAcctId);

function AccountsRolesScreen({
  touch,
  change,
  organizationID,
  selectedAWSAccountID,
  selectedAWSBillingAccountID,
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
  offlineToken,
  setOfflineToken,
  isHypershiftSelected,
}) {
  const [AWSAccountIDs, setAWSAccountIDs] = useState([]);
  const [noUserForSelectedAWSAcct, setNoUserForSelectedAWSAcct] = useState(false);
  const [awsIDsErrorBox, setAwsIDsErrorBox] = useState(null);
  const [isAssocAwsAccountModalOpen, setIsAssocAwsAccountModalOpen] = useState(false);
  const [refreshButtonClicked, setRefreshButtonClicked] = useState(false);
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

  const onAssociateAwsAccountModalOpen = () => {
    openAssociateAWSAccountModal();
    setIsAssocAwsAccountModalOpen(true);
  };

  return (
    <Form onSubmit={() => false}>
      <Grid hasGutter className="pf-u-mt-md">
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
            launchAssocAWSAcctModal={onAssociateAwsAccountModalOpen}
            refresh={{
              onRefresh: () => {
                setRefreshButtonClicked(true);
                resetAWSAccountFields();
              },
              text: 'Refresh to view newly associated AWS accounts and account-roles.',
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
              onAssociateAwsAccountModalOpen();
            }}
          >
            How to associate a new account
          </Button>
        </GridItem>
        <GridItem span={7} />
        {isHypershiftSelected && (
          <AWSBillingAccount
            change={change}
            selectedAWSBillingAccountID={selectedAWSBillingAccountID}
            selectedAWSAccountID={selectedAWSAccountID}
          />
        )}
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
            openAssociateAwsAccountModal={onAssociateAwsAccountModalOpen}
          />
        )}

        {(getUserRoleResponse?.error || noUserForSelectedAWSAcct) && (
          <GridItem span={8} className="pf-u-mt-sm">
            <AwsRoleErrorAlert
              title="A user-role could not be detected"
              openAssociateAwsAccountModal={onAssociateAwsAccountModalOpen}
            />
          </GridItem>
        )}
      </Grid>
      <AssociateAwsAccountModal
        isOpen={isAssocAwsAccountModalOpen}
        onClose={onAssociateAwsAccountModalClose}
      />
    </Form>
  );
}

AccountsRolesScreen.propTypes = {
  touch: PropTypes.func,
  change: PropTypes.func,
  selectedAWSAccountID: PropTypes.string,
  selectedAWSBillingAccountID: PropTypes.string,
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
  offlineToken: PropTypes.string,
  setOfflineToken: PropTypes.func,
  isHypershiftSelected: PropTypes.bool.isRequired,
};

export default AccountsRolesScreen;
