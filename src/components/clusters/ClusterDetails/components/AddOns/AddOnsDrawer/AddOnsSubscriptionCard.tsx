import * as React from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Select,
  SelectOption,
} from '@patternfly/react-core';
import ExternalLink from '~/components/common/ExternalLink';
import {
  SubscriptionModels,
  SubscriptionModel,
  SetSubscriptionModel,
  CloudAccount,
  CloudProviders,
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
    aws: 'https://aws.amazon.com/marketplace/pp/prodview-co7uaxdm7qnkq',
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
  cloudAccounts?: {
    rhm: CloudAccount[];
    aws: CloudAccount[];
    azure: CloudAccount[];
  };
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
  }, [installedAddOn]);
  React.useEffect(() => {
    if (activeSubscription?.billingModel === 'standard') {
      setAccount('');
    }
  }, [activeSubscription?.billingModel]);
  return (
    <Card
      id={billingModel}
      isSelectableRaised={hasCloudAccounts}
      isSelected={activeSubscription?.billingModel === billingModel}
      isDisabledRaised={!hasCloudAccounts || !hasQuota || !isReady}
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
      {!hasCloudAccounts ? (
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
          <Select
            isOpen={isOpen}
            selections={account}
            onToggle={() => setIsOpen(!isOpen)}
            onSelect={(_, selection) => {
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
                <SelectOption key={accountId} value={accountId}>
                  {accountId}
                </SelectOption>
              ))}
          </Select>
        </CardFooter>
      )}
    </Card>
  );
};

export default AddOnsSubscriptionCard;
