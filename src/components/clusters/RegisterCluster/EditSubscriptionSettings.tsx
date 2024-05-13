import React from 'react';

import { subscriptionSupportLevels } from '~/common/subscriptionTypes';

import EditSubscriptionFields from '../common/EditSubscriptionSettingsDialog/EditSubscriptionSettingsFields';

type EditSubscriptionSettingsProps = {
  setSettings: (value: any) => void;
  canSubscribeOCP: boolean;
  isValid?: boolean;
  supportLevel?: (typeof subscriptionSupportLevels)[keyof typeof subscriptionSupportLevels];
  canSubscribeMarketplaceOCP?: boolean;
};

const EditSubscriptionSettings = ({
  setSettings,
  canSubscribeOCP,
  isValid = true,
  supportLevel = subscriptionSupportLevels.EVAL,
  canSubscribeMarketplaceOCP = false,
}: EditSubscriptionSettingsProps) => {
  const initialSettings = { support_level: supportLevel, isValid };

  return (
    <EditSubscriptionFields
      initialSettings={initialSettings}
      onSettingsChange={setSettings}
      canSubscribeStandardOCP={canSubscribeOCP}
      canSubscribeMarketplaceOCP={canSubscribeMarketplaceOCP}
    />
  );
};

export default EditSubscriptionSettings;
