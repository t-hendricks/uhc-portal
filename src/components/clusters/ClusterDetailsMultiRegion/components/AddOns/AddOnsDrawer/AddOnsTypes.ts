export type SubscriptionModel =
  | 'standard'
  | 'marketplace'
  | 'marketplace-rhm'
  | 'marketplace-aws'
  | 'marketplace-azure'
  | 'no-quota';

export type CloudProviders = 'rhm' | 'aws' | 'azure';

export type CloudAccount = {
  // eslint-disable-next-line camelcase
  cloud_account_id: string;
  // eslint-disable-next-line camelcase
  cloud_provider_id: CloudProviders;
};

export type SubscriptionModels = {
  [addOn: string]: {
    addOn: string;
    billingModel: SubscriptionModel;
    cloudAccount?: string;
  };
};

export type SetSubscriptionModel = ({
  addOn: { addOn, billingModel, cloudAccount },
}: {
  [addOn: string]: {
    addOn: string;
    billingModel: SubscriptionModel;
    cloudAccount?: string;
  };
}) => void;
