/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect, useRef, ReactElement } from 'react';
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
import { AwsRoleErrorAlert } from './AwsRoleErrorAlert';
import AWSAccountSelection, { AWS_ACCOUNT_ROSA_LOCALSTORAGE_KEY } from './AWSAccountSelection';
import AWSBillingAccount from './AWSBillingAccount/AWSBillingAccount';
import { useAssociateAWSAccountDrawer } from './AssociateAWSAccountDrawer/AssociateAWSAccountDrawer';

export const isUserRoleForSelectedAWSAccount = (users: any[], awsAcctId: any) =>
  users.some((user: { aws_id: any }) => user.aws_id === awsAcctId);

export const getUserRoleForSelectedAWSAccount = (users: any[], awsAcctId: any) =>
  users.find((user: { aws_id: any }) => user.aws_id === awsAcctId);

export interface AccountsRolesScreenProps {
  touch?: any;
  change?: any;
  selectedAWSAccountID?: string;
  selectedAWSBillingAccountID?: string;
  selectedInstallerRoleARN?: string;
  getAWSAccountIDs: any;
  getAWSAccountIDsResponse: any;
  getAWSAccountRolesARNs: any;
  getAWSAccountRolesARNsResponse: any;
  getUserRoleResponse: any;
  clearGetAWSAccountIDsResponse: any;
  clearGetAWSAccountRolesARNsResponse: any;
  clearGetUserRoleResponse: any;
  organizationID: string;
  rosaMaxOSVersion?: string;
  offlineToken?: string;
  setOfflineToken?: any;
  isHypershiftSelected: boolean;
}

function AccountsRolesScreen({
  touch,
  change,
  organizationID,
  selectedAWSAccountID,
  selectedAWSBillingAccountID,
  selectedInstallerRoleARN,
  rosaMaxOSVersion,
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
}: AccountsRolesScreenProps) {
  const [AWSAccountIDs, setAWSAccountIDs] = useState<string[]>([]);
  const [noUserForSelectedAWSAcct, setNoUserForSelectedAWSAcct] = useState(false);
  const [awsIDsErrorBox, setAwsIDsErrorBox] = useState<ReactElement | null>(null);
  const [refreshButtonClicked, setRefreshButtonClicked] = useState(false);
  const openDrawerButtonRef = useRef(null);
  const hasAWSAccounts = AWSAccountIDs.length > 0;
  const track = useAnalytics();
  const { openDrawer } = useAssociateAWSAccountDrawer();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (getUserRoleResponse.fulfilled && selectedAWSAccountID) {
      const found = isUserRoleForSelectedAWSAccount(getUserRoleResponse.data, selectedAWSAccountID);
      setNoUserForSelectedAWSAcct(!found);
      clearGetUserRoleResponse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserRoleResponse.fulfilled, selectedAWSAccountID]);

  // if aws acct ids default to first available aws account
  useEffect(() => {
    if (hasAWSAccounts && !selectedAWSAccountID) {
      let selectedAWSAccountID = localStorage.getItem(AWS_ACCOUNT_ROSA_LOCALSTORAGE_KEY);
      if (!selectedAWSAccountID || !AWSAccountIDs.includes(selectedAWSAccountID)) {
        [selectedAWSAccountID] = AWSAccountIDs;
      }
      change('associated_aws_id', selectedAWSAccountID);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAWSAccountIDsResponse]);

  useEffect(() => {
    if (getUserRoleResponse?.error || noUserForSelectedAWSAcct) {
      track(trackEvents.MissingUserRole);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserRoleResponse?.error, noUserForSelectedAWSAcct]);

  const onClick = useCallback(
    (event) => {
      openDrawer({ focusOnClose: event.target, onClose: clearGetAWSAccountIDsResponse });
    },
    [clearGetAWSAccountIDsResponse, openDrawer],
  );

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
            accounts={AWSAccountIDs.map((account) => ({ cloud_account_id: account }))}
            selectedAWSAccountID={selectedAWSAccountID}
            isLoading={refreshButtonClicked && getAWSAccountIDsResponse.pending}
            isDisabled={getAWSAccountIDsResponse.pending}
            clearGetAWSAccountIDsResponse={clearGetAWSAccountIDsResponse}
          />
          <Button
            variant="secondary"
            className="pf-u-mt-md"
            ref={openDrawerButtonRef}
            onClick={onClick}
          >
            How to associate a new AWS account
          </Button>
        </GridItem>
        <GridItem span={7} />
        {isHypershiftSelected && (
          <AWSBillingAccount
            change={change}
            selectedAWSBillingAccountID={selectedAWSBillingAccountID || ''}
            selectedAWSAccountID={selectedAWSAccountID || ''}
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
          />
        )}

        {(getUserRoleResponse?.error || noUserForSelectedAWSAcct) && (
          <GridItem span={8} className="pf-u-mt-sm">
            <AwsRoleErrorAlert title="A user-role could not be detected" targetRole="user" />
          </GridItem>
        )}
      </Grid>
    </Form>
  );
}

export default AccountsRolesScreen;
