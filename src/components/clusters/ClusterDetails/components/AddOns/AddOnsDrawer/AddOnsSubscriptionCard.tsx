import * as React from 'react';
import { Card, CardBody, CardFooter, CardTitle } from '@patternfly/react-core';
import {
  Select as SelectDeprecated,
  SelectOption as SelectOptionDeprecated,
} from '@patternfly/react-core/deprecated';
import { BillingQuotaCloudAccounts } from '~/components/clusters/common/quotaModel';
import ExternalLink from '~/components/common/ExternalLink';
import {
  CloudProviders,
  SetSubscriptionModel,
  SubscriptionModel,
  SubscriptionModels,
} from './AddOnsTypes';

const SELECT_ACCOUNT_PLACEHOLDER = 'Select an account';
const marketplaceLinks: {
  [addOn: string]: {
    rhm?: string;
    aws?: string;
    azure?: string;
  };
} = {
  'managed-odh': {
    aws: 'https://aws.amazon.com/marketplace/search/results?searchTerms=OpenShift+Data+Science+enables',
  },
};

const AddOnsSubscriptionCard = ({
  subscriptionModels,
  setSubscriptionModel,
  activeCardId,
  hasQuota,
  isReady,
  cloudAccounts,
  installedAddOn,
  billingModel,
  name,
  cloudProvider,
}: {
  subscriptionModels: SubscriptionModels;
  setSubscriptionModel: SetSubscriptionModel;
  activeCardId: string;
  hasQuota: boolean;
  isReady: boolean;
  cloudAccounts?: BillingQuotaCloudAccounts;
  installedAddOn: any;
  billingModel: SubscriptionModel;
  name: string;
  cloudProvider: CloudProviders;
}) => {
  const activeSubscription = subscriptionModels[activeCardId];
  const hasCloudAccounts = cloudAccounts && cloudAccounts[cloudProvider].length > 0;

  const [isOpen, setIsOpen] = React.useState(false);
  const [account, setAccount] = React.useState(activeSubscription.cloudAccount);
  React.useEffect(() => {
    // choose the default marketplace account if applicable
    if (installedAddOn && installedAddOn?.billing?.billing_marketplace_account) {
      const installedAccount = installedAddOn.billing.billing_marketplace_account;
      if (installedAddOn.billing.billing_model === billingModel) {
        setAccount(installedAccount);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [installedAddOn]);
  React.useEffect(() => {
    if (activeSubscription?.billingModel === 'standard') {
      setAccount('');
    }
  }, [activeSubscription?.billingModel]);
  return (
    <Card
      id={billingModel}
      isSelectableRaised
      isSelected={activeSubscription?.billingModel === billingModel}
      isDisabled={!hasCloudAccounts || !hasQuota || !isReady}
      onClick={() => {
        if (account) {
          // re-select
          setSubscriptionModel({
            ...subscriptionModels,
            [activeCardId]: {
              addOn: activeCardId,
              billingModel,
              cloudAccount: account,
            },
          });
        }
      }}
    >
      <CardTitle>{name}</CardTitle>
      <CardBody>Flexible usage. Pay only for the services you use.</CardBody>
      {!hasCloudAccounts || !hasQuota ? (
        <CardFooter>
          <small>Not available.</small>{' '}
          {marketplaceLinks[activeCardId] && marketplaceLinks[activeCardId][cloudProvider] && (
            <ExternalLink href={marketplaceLinks[activeCardId][cloudProvider] as string}>
              Enable in {name}.
            </ExternalLink>
          )}
        </CardFooter>
      ) : (
        <CardFooter>
          <SelectDeprecated
            isOpen={isOpen}
            selections={account}
            onToggle={() => setIsOpen(!isOpen)}
            onSelect={(event, selection) => {
              event.stopPropagation();
              setSubscriptionModel({
                ...subscriptionModels,
                [activeCardId]: {
                  addOn: activeCardId,
                  billingModel,
                  cloudAccount: selection as string,
                },
              });
              setAccount(selection as string);
              setIsOpen(false);
            }}
            placeholderText={SELECT_ACCOUNT_PLACEHOLDER}
            isDisabled={!isReady}
          >
            {cloudAccounts &&
              cloudAccounts[cloudProvider].map(({ cloud_account_id: accountId }) => (
                <SelectOptionDeprecated key={accountId} value={accountId}>
                  {accountId}
                </SelectOptionDeprecated>
              ))}
          </SelectDeprecated>
        </CardFooter>
      )}
    </Card>
  );
};

export default AddOnsSubscriptionCard;
