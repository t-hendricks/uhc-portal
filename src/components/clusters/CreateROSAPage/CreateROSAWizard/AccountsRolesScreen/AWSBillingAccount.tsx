import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, GridItem, Text, TextVariants, Title } from '@patternfly/react-core';
import { Field } from 'redux-form';

import AWSAccountSelection from './AWSAccountSelection';
import ErrorBox from '../../../../common/ErrorBox';
import { required } from '../../../../../common/validators';
import { getAwsBillingAccountsFromQuota } from '~/components/clusters/common/quotaSelectors';
import { useGlobalState } from '~/redux/hooks/useGlobalState';
import { getAWSBillingAccountIDs } from '../rosaActions';
import { shouldRefetchQuota } from '~/common/helpers';
import links from '~/common/installLinks.mjs';

interface AWSBillingAccountProps {
  change: (field: string, value: string) => void;
  selectedAWSBillingAccountID: string;
}

const AWSBillingAccount = ({ change, selectedAWSBillingAccountID }: AWSBillingAccountProps) => {
  const dispatch = useDispatch();
  const organization = useGlobalState((state) => state.userProfile.organization);
  const getAWSBillingAccountsResponse = useGlobalState(
    (state) => state.rosaReducer.getAWSBillingAccountsResponse,
  );
  const [accountsIds, setAccountsIds] = useState<string[]>([]);

  const refresh = useCallback(() => {
    dispatch(getAWSBillingAccountIDs(organization.details?.id));
  }, [dispatch]);

  useEffect(() => {
    // if there is (recent) quota data in global state
    if (!shouldRefetchQuota(organization)) {
      // extract billing accounts out of it
      setAccountsIds(getAwsBillingAccountsFromQuota(organization.quotaList));
    } else {
      refresh();
    }
  }, []);

  useEffect(() => {
    if (getAWSBillingAccountsResponse.fulfilled) {
      setAccountsIds(getAWSBillingAccountsResponse.data);
      // if selected account is not on the list after refresh
      if (
        selectedAWSBillingAccountID &&
        !getAWSBillingAccountsResponse.data.includes(selectedAWSBillingAccountID)
      ) {
        // reset the field
        change('billing_account_id', '');
      }
    }
  }, [getAWSBillingAccountsResponse]);

  // if there's only one account, select it by default
  useEffect(() => {
    if (accountsIds?.length === 1 && !selectedAWSBillingAccountID) {
      change('billing_account_id', accountsIds[0]);
    }
  }, [accountsIds, selectedAWSBillingAccountID]);

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
          refresh={{
            onRefresh: refresh,
            text: 'Refresh to view newly associated AWS billing accounts.',
          }}
          validate={required}
          extendedHelpText={
            <>
              Connect ROSA to a new billing account. To add a different AWS account, log in to the
              account, and click get started.
            </>
          }
          AWSAccountIDs={accountsIds}
          selectedAWSAccountID={selectedAWSBillingAccountID}
          isLoading={organization.pending || getAWSBillingAccountsResponse.pending}
          isDisabled={organization.pending || getAWSBillingAccountsResponse.pending}
          isBillingAccount
        />
        <Button
          variant="secondary"
          className="pf-u-mt-md"
          component="a"
          href={links.AWS_CONSOLE_ROSA_HOME}
          target="_blank"
        >
          Connect ROSA to a new AWS billing account
        </Button>
      </GridItem>
      <GridItem span={7} />
    </>
  );
};

export default AWSBillingAccount;
