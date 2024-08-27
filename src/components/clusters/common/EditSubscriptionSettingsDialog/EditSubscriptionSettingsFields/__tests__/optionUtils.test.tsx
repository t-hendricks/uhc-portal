import { billingModels, subscriptionSettings } from '~/common/subscriptionTypes';
import { Subscription, SubscriptionCommonFields } from '~/types/accounts_mgmt.v1';

import { defaultSubscription } from '../../../__tests__/defaultClusterFromSubscription.fixtures';
import { getOptions, resetOptions } from '../optionUtils';

describe('getOptions', () => {
  describe('SUPPORT_LEVEL', () => {
    const expectedOptions = [
      {
        label: 'Premium',
        value: SubscriptionCommonFields.support_level.PREMIUM,
        isChecked: true,
      },
      { label: 'Standard', value: SubscriptionCommonFields.support_level.STANDARD },
      { label: 'Self-Support', value: SubscriptionCommonFields.support_level.SELF_SUPPORT },
    ];

    it('should return correct options for whatever the support_level field', () => {
      const subscription: Subscription = {
        ...defaultSubscription,
        id: '123',
        support_level: SubscriptionCommonFields.support_level.PREMIUM,
      };
      const options = getOptions(subscription, subscriptionSettings.SUPPORT_LEVEL);

      expect(options).toEqual(expectedOptions);
    });

    it('should return correct options for whatever the support_level field and no subscription id', () => {
      const subscription: Subscription = {
        ...defaultSubscription,
        support_level: SubscriptionCommonFields.support_level.PREMIUM,
      };
      const options = getOptions(subscription, subscriptionSettings.SUPPORT_LEVEL);

      expect(options).toEqual([
        ...expectedOptions,
        {
          label: 'Self-Support 60-day evaluation',
          value: SubscriptionCommonFields.support_level.EVAL,
        },
      ]);
    });

    it('should return correct options for EVAL support_level field value', () => {
      const subscription: Subscription = {
        ...defaultSubscription,
        support_level: SubscriptionCommonFields.support_level.EVAL,
      };
      const options = getOptions(subscription, subscriptionSettings.SUPPORT_LEVEL);

      expect(options).toEqual([
        {
          label: 'Premium',
          value: SubscriptionCommonFields.support_level.PREMIUM,
        },
        { label: 'Standard', value: SubscriptionCommonFields.support_level.STANDARD },
        { label: 'Self-Support', value: SubscriptionCommonFields.support_level.SELF_SUPPORT },
        {
          isChecked: true,
          label: 'Self-Support 60-day evaluation',
          value: SubscriptionCommonFields.support_level.EVAL,
        },
      ]);
    });
  });

  it('should return correct options for USAGE', () => {
    const subscription: Subscription = {
      ...defaultSubscription,
      id: '123',
      usage: SubscriptionCommonFields.usage.PRODUCTION,
    };
    const options = getOptions(subscription, subscriptionSettings.USAGE);

    expect(options).toEqual([
      {
        label: 'Production',
        value: SubscriptionCommonFields.usage.PRODUCTION,
        isDefault: true,
        isChecked: true,
      },
      { label: 'Development/Test', value: SubscriptionCommonFields.usage.DEVELOPMENT_TEST },
      { label: 'Disaster Recovery', value: SubscriptionCommonFields.usage.DISASTER_RECOVERY },
    ]);
  });

  it('should return correct options for SERVICE_LEVEL', () => {
    const subscription: Subscription = {
      ...defaultSubscription,
      id: '123',
    };
    const options = getOptions(subscription, subscriptionSettings.SERVICE_LEVEL);

    expect(options).toEqual([
      {
        isChecked: true,
        label: 'Red Hat support (L1-L3)',
        value: SubscriptionCommonFields.service_level.L1_L3,
        isDefault: true,
      },
      { label: 'Partner support (L3)', value: SubscriptionCommonFields.service_level.L3_ONLY },
    ]);
  });

  it('should return correct options for SYSTEM_UNITS', () => {
    const subscription: Subscription = {
      ...defaultSubscription,
      id: '123',
    };
    const options = getOptions(subscription, subscriptionSettings.SYSTEM_UNITS);

    expect(options).toEqual([
      {
        isChecked: true,
        label: 'Cores or vCPUs',
        value: SubscriptionCommonFields.system_units.CORES_V_CPU,
        isDefault: true,
      },
      { label: 'Sockets', value: SubscriptionCommonFields.system_units.SOCKETS },
    ]);
  });

  describe('CLUSTER_BILLING_MODEL', () => {
    it('should return correct options with marketplace and canSubscribeMarketplaceOCP true', () => {
      const subscription: Subscription = {
        ...defaultSubscription,
        id: '123',
        cluster_billing_model: billingModels.MARKETPLACE,
      };
      const options = getOptions(subscription, subscriptionSettings.CLUSTER_BILLING_MODEL, true);

      expect(options).toEqual([
        {
          label: 'Annual: Fixed capacity subscription from Red Hat',
          value: billingModels.STANDARD,
        },
        {
          label: 'On-Demand (Hourly): Flexible usage billed through Red Hat Marketplace',
          value: billingModels.MARKETPLACE,
          isDefault: true,
          isChecked: true,
        },
      ]);
    });
    it('should return correct options with standard and canSubscribeMarketplaceOCP false', () => {
      const subscription: Subscription = {
        ...defaultSubscription,
        id: '123',
        cluster_billing_model: billingModels.STANDARD,
      };
      const options = getOptions(subscription, subscriptionSettings.CLUSTER_BILLING_MODEL);

      expect(options).toEqual([
        {
          label: 'Annual: Fixed capacity subscription from Red Hat',
          value: billingModels.STANDARD,
          isDefault: true,
          isChecked: true,
        },
        {
          label: 'On-Demand (Hourly): Flexible usage billed through Red Hat Marketplace',
          value: billingModels.MARKETPLACE,
        },
      ]);
    });
  });
});

describe('resetOptions', () => {
  it('should reset options correctly', () => {
    const subscription: Subscription = {
      ...defaultSubscription,
      id: '123',
      support_level: SubscriptionCommonFields.support_level.PREMIUM,
      usage: SubscriptionCommonFields.usage.PRODUCTION,
      cluster_billing_model: billingModels.STANDARD,
      system_units: SubscriptionCommonFields.system_units.CORES_V_CPU,
    };

    const reset = resetOptions(subscription);

    expect(reset).toEqual({
      service_level: [
        {
          isChecked: true,
          label: 'Red Hat support (L1-L3)',
          value: SubscriptionCommonFields.service_level.L1_L3,
          isDefault: true,
        },
        { label: 'Partner support (L3)', value: SubscriptionCommonFields.service_level.L3_ONLY },
      ],
      support_level: [
        {
          label: 'Premium',
          value: SubscriptionCommonFields.support_level.PREMIUM,
          isChecked: true,
        },
        { label: 'Standard', value: SubscriptionCommonFields.support_level.STANDARD },
        { label: 'Self-Support', value: SubscriptionCommonFields.support_level.SELF_SUPPORT },
      ],
      usage: [
        {
          label: 'Production',
          value: SubscriptionCommonFields.usage.PRODUCTION,
          isDefault: true,
          isChecked: true,
        },
        { label: 'Development/Test', value: SubscriptionCommonFields.usage.DEVELOPMENT_TEST },
        { label: 'Disaster Recovery', value: SubscriptionCommonFields.usage.DISASTER_RECOVERY },
      ],
      cluster_billing_model: [
        {
          label: 'Annual: Fixed capacity subscription from Red Hat',
          value: billingModels.STANDARD,
          isDefault: true,
          isChecked: true,
        },
        {
          label: 'On-Demand (Hourly): Flexible usage billed through Red Hat Marketplace',
          value: billingModels.MARKETPLACE,
        },
      ],
      system_units: [
        {
          label: 'Cores or vCPUs',
          value: SubscriptionCommonFields.system_units.CORES_V_CPU,
          isDefault: true,
          isChecked: true,
        },
        { label: 'Sockets', value: SubscriptionCommonFields.system_units.SOCKETS },
      ],
    });
  });
});
