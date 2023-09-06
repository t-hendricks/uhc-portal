import {
  Alert,
  AlertVariant,
  Button,
  GridItem,
  Popover,
  Stack,
  StackItem,
  Text,
  TextVariants,
  Title,
} from '@patternfly/react-core';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Field } from 'redux-form';

import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';

import { shouldRefetchQuota } from '~/common/helpers';
import links from '~/common/installLinks.mjs';
import { getAwsBillingAccountsFromQuota } from '~/components/clusters/common/quotaSelectors';
import { useGlobalState } from '~/redux/hooks/useGlobalState';
import { CloudAccount } from '~/types/accounts_mgmt.v1/models/CloudAccount';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import { HCP_AWS_BILLING_SHOW, HCP_AWS_BILLING_REQUIRED } from '~/redux/constants/featureConstants';
import { required } from '../../../../../../common/validators';
import ErrorBox from '../../../../../common/ErrorBox';
import ExternalLink from '../../../../../common/ExternalLink';
import { getAWSBillingAccountIDs } from '../../rosaActions';
import AWSAccountSelection from '../AWSAccountSelection';
import ContractInfo from './ContractInfo';
import { hasContract } from './awsBillingAccountHelper';

interface AWSBillingAccountProps {
  change: (field: string, value: string) => void;
  selectedAWSBillingAccountID: string;
  selectedAWSAccountID: string;
}

const AWSBillingAccount = ({
  change,
  selectedAWSBillingAccountID,
  selectedAWSAccountID,
}: AWSBillingAccountProps) => {
  const dispatch = useDispatch();
  const isVisible = useFeatureGate(HCP_AWS_BILLING_SHOW);
  const isRequired = useFeatureGate(HCP_AWS_BILLING_REQUIRED);
  const organization = useGlobalState((state) => state.userProfile.organization);
  const getAWSBillingAccountsResponse = useGlobalState(
    (state) => state.rosaReducer.getAWSBillingAccountsResponse,
  );

  const [cloudAccounts, setCloudAccounts] = useState<CloudAccount[]>([]);

  const refresh = useCallback(() => {
    dispatch(getAWSBillingAccountIDs(organization.details?.id) as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    // if there is (recent) quota data in global state
    if (!shouldRefetchQuota(organization)) {
      // extract billing accounts out of it
      setCloudAccounts(getAwsBillingAccountsFromQuota(organization.quotaList));
    } else {
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (getAWSBillingAccountsResponse.fulfilled) {
      setCloudAccounts(getAWSBillingAccountsResponse.data);
      // if selected account is not on the list after refresh
      if (
        selectedAWSBillingAccountID &&
        !getAWSBillingAccountsResponse.data.includes(selectedAWSBillingAccountID)
      ) {
        // reset the field
        change('billing_account_id', '');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAWSBillingAccountsResponse]);

  // if there's only one account, select it by default
  useEffect(() => {
    if (cloudAccounts?.length === 1 && !selectedAWSBillingAccountID) {
      change('billing_account_id', cloudAccounts[0].cloud_account_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloudAccounts, selectedAWSBillingAccountID]);

  const connectNewAcctBtn = (
    <ExternalLink
      isButton
      variant="secondary"
      className="pf-u-mt-md"
      href={links.AWS_CONSOLE_ROSA_HOME}
      noIcon
    >
      Connect ROSA to a new AWS billing account
    </ExternalLink>
  );

  const selectedAccount = cloudAccounts.find(
    (account) => account.cloud_account_id === selectedAWSBillingAccountID,
  );
  const isContractEnabled = !!selectedAccount && hasContract(selectedAccount);

  if (!isVisible) {
    return <></>;
  }

  return (
    <>
      <GridItem span={8}>
        <Title headingLevel="h3">AWS billing account</Title>
        <Text component={TextVariants.p}>
          This account will be charged for your subscription usage. You can select an already
          connected AWS account or sign in to a different AWS account that you want to connect to
          ROSA.
        </Text>
      </GridItem>
      <GridItem span={4} />
      <GridItem sm={12} md={7}>
        {(organization.error || getAWSBillingAccountsResponse.error) && (
          <ErrorBox
            message="Error getting associated AWS billing account id(s)"
            response={organization.error ? organization : getAWSBillingAccountsResponse}
          />
        )}
        <Field
          component={AWSAccountSelection}
          name="billing_account_id"
          label="AWS billing account"
          validate={isRequired ? required : undefined}
          required={isRequired}
          refresh={{
            onRefresh: refresh,
            text: 'Refresh to view newly associated AWS billing accounts.',
          }}
          extendedHelpText={
            <>
              Connect ROSA to a new billing account. To add a different AWS account, log in to the
              account, and click get started.
            </>
          }
          accounts={cloudAccounts}
          selectedAWSAccountID={selectedAWSBillingAccountID}
          isLoading={organization.pending || getAWSBillingAccountsResponse.pending}
          isDisabled={organization.pending || getAWSBillingAccountsResponse.pending}
          isBillingAccount
        />
        {isContractEnabled ? (
          <Stack>
            <StackItem>
              <Popover bodyContent={<ContractInfo {...selectedAccount.contracts[0]} />}>
                <Button variant="link" icon={<OutlinedQuestionCircleIcon />}>
                  Contract enabled for this billing account
                </Button>
              </Popover>
            </StackItem>
            <StackItem>{connectNewAcctBtn}</StackItem>
          </Stack>
        ) : (
          connectNewAcctBtn
        )}
      </GridItem>
      <GridItem span={7} />
      <GridItem sm={12} md={12}>
        {selectedAWSBillingAccountID !== selectedAWSAccountID &&
        selectedAWSBillingAccountID &&
        selectedAWSAccountID ? (
          <Alert
            isInline
            variant={AlertVariant.info}
            component="p"
            role="alert"
            title="The selected AWS billing account is a different account than your AWS infrastructure account.
            The AWS billing account will be charged for subscription usage.  The AWS infrastructure account will be used for managing the cluster."
          />
        ) : null}
      </GridItem>
    </>
  );
};

export default AWSBillingAccount;
