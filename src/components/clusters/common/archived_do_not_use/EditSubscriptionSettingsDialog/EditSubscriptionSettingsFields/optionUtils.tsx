import React from 'react';
import { findIndex, get } from 'lodash';

import { subscriptionSettings } from '~/common/subscriptionTypes';
import { Subscription, SubscriptionCommonFields } from '~/types/accounts_mgmt.v1';

import { EditSubcriptionOption } from './model/EditSubcriptionOption';
import { SubcriptionOptionType } from './model/SubcriptionOptionType';
import {
  MARKETPLACE_BILLING_MODEL_LABEL,
  OPTIONS,
  STANDARD_BILLING_MODEL_LABEL,
} from './constants';

const getOptions = (
  subscription: Subscription,
  setting: SubcriptionOptionType,
  canSubscribeMarketplaceOCP?: boolean,
): EditSubcriptionOption[] => {
  const value = get(subscription, setting);
  let options: EditSubcriptionOption[] = [];
  switch (setting) {
    case subscriptionSettings.SUPPORT_LEVEL:
      options = [
        { label: 'Premium', value: SubscriptionCommonFields.support_level.PREMIUM },
        { label: 'Standard', value: SubscriptionCommonFields.support_level.STANDARD },
        { label: 'Self-Support', value: SubscriptionCommonFields.support_level.SELF_SUPPORT },
      ];
      if (value === SubscriptionCommonFields.support_level.EVAL || !subscription.id) {
        options.push({
          label: 'Self-Support 60-day evaluation',
          value: SubscriptionCommonFields.support_level.EVAL,
        });
      } else if (value === SubscriptionCommonFields.support_level.NONE) {
        options.push({
          label: (
            <span className="subscription-settings expired-eval-option">Expired evaluation</span>
          ),
          value: SubscriptionCommonFields.support_level.NONE,
        });
      }
      break;
    case subscriptionSettings.USAGE:
      options = [
        { label: 'Production', value: SubscriptionCommonFields.usage.PRODUCTION, isDefault: true },
        { label: 'Development/Test', value: SubscriptionCommonFields.usage.DEVELOPMENT_TEST },
        { label: 'Disaster Recovery', value: SubscriptionCommonFields.usage.DISASTER_RECOVERY },
      ];
      break;
    case subscriptionSettings.SERVICE_LEVEL:
      options = [
        {
          label: 'Red Hat support (L1-L3)',
          value: SubscriptionCommonFields.service_level.L1_L3,
          isDefault: true,
        },
        { label: 'Partner support (L3)', value: SubscriptionCommonFields.service_level.L3_ONLY },
      ];
      break;
    case subscriptionSettings.SYSTEM_UNITS:
      options = [
        {
          label: 'Cores or vCPUs',
          value: SubscriptionCommonFields.system_units.CORES_V_CPU,
          isDefault: true,
        },
        { label: 'Sockets', value: SubscriptionCommonFields.system_units.SOCKETS },
      ];
      break;
    case subscriptionSettings.CLUSTER_BILLING_MODEL:
      options = [
        {
          label: STANDARD_BILLING_MODEL_LABEL,
          value: SubscriptionCommonFields.cluster_billing_model.STANDARD,
        },
        {
          label: MARKETPLACE_BILLING_MODEL_LABEL,
          value: SubscriptionCommonFields.cluster_billing_model.MARKETPLACE,
        },
      ];
      if (canSubscribeMarketplaceOCP) {
        options[1].isDefault = true;
      } else {
        // default to standard if both are missing
        options[0].isDefault = true;
      }
      break;
    default:
  }

  const i = findIndex(options, { value });
  if (i >= 0) {
    options[i].isChecked = true;
  } else {
    // fallback to default
    const j = findIndex(options, 'isDefault');
    if (j >= 0) {
      options[j].isChecked = true;
    }
  }
  return options;
};

const resetOptions = (
  subscription: Subscription,
): { [index: string]: EditSubcriptionOption[] | number } =>
  OPTIONS.reduce(
    (acc, setting) => ({ ...acc, [`${setting}`]: getOptions(subscription, setting) }),
    {},
  );

export { getOptions, resetOptions };
