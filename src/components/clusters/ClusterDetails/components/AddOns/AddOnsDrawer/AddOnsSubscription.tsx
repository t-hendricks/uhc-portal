import * as React from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Form,
  FormGroup,
  Radio,
} from '@patternfly/react-core';
import AddOnsConstants from '../AddOnsConstants';
import AddOnsSubscriptionCard from './AddOnsSubscriptionCard';
import { SubscriptionModels, SetSubscriptionModel, CloudAccount } from './AddOnsTypes';

const AddOnsSubscription = ({
  activeCardId,
  billingQuota,
  installedAddOn,
  subscriptionModels,
  setAddonsDrawer,
}: {
  activeCardId: string;
  billingQuota: {
    standard?: {
      allowed: number;
      consumed: number;
      cost: number;
    };
    marketplace?: {
      allowed: number;
      consumed: number;
      cost: number;
      cloudAccounts: {
        rhm: CloudAccount[];
        aws: CloudAccount[];
        azure: CloudAccount[];
      };
    };
  };
  installedAddOn: any;
  subscriptionModels: SubscriptionModels;
  setAddonsDrawer: (props: any) => void;
}) => {
  const setSubscriptionModel: SetSubscriptionModel = (models) => {
    setAddonsDrawer({
      subscriptionModels: models,
    });
  };
  const activeSubscription = subscriptionModels[activeCardId];

  // TODO: We are hiding RHM and Azure options for now until backend is ready
  const hideRhmAzureForNow = true;
  // TODO: PATCH operation to change billing model after install not yet supported
  const cannotModifyBillingAfterInstall = Boolean(installedAddOn);

  const isReady =
    !cannotModifyBillingAfterInstall &&
    (!installedAddOn || installedAddOn.state === AddOnsConstants.INSTALLATION_STATE.READY);
  const hasQuotaStandard =
    Boolean(installedAddOn) ||
    (billingQuota.standard
      ? billingQuota.standard.consumed + billingQuota.standard.cost <= billingQuota.standard.allowed
      : false);
  const hasQuotaMarketplace =
    Boolean(installedAddOn) ||
    (billingQuota.marketplace
      ? billingQuota.marketplace.consumed + billingQuota.marketplace.cost <=
        billingQuota.marketplace.allowed
      : false);
  const standardNoBilling = billingQuota.standard === undefined;
  const marketplaceNoBilling = billingQuota.marketplace === undefined;

  const getDefaultBillingModel = () => {
    if (installedAddOn) {
      return installedAddOn.billing.billing_model;
    }
    if (standardNoBilling) {
      // standard subscription model not offered for this addon
      if (!hasQuotaMarketplace) {
        // marketplace subscription offered but no quota
        return 'no-quota';
      }
      return 'marketplace';
    }
    if (marketplaceNoBilling) {
      // marketplace subscription model not offered for this addon
      if (!hasQuotaStandard) {
        // standard subscription offered but no quota
        return 'no-quota';
      }
      return 'standard';
    }
    // both standard and marketplace subscription models are offered, check quota
    if (!hasQuotaStandard) {
      if (!hasQuotaMarketplace) {
        return 'no-quota';
      }
      return 'marketplace';
    }
    return 'standard';
  };

  React.useEffect(() => {
    if (!subscriptionModels[activeCardId]) {
      // choose the default subscription model
      setSubscriptionModel({
        ...subscriptionModels,
        [activeCardId]: {
          addOn: activeCardId,
          billingModel: getDefaultBillingModel(),
          cloudAccount: installedAddOn?.billing?.billing_marketplace_account || '',
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptionModels, activeCardId, installedAddOn]);

  const standardOptions = (
    <Card
      id="standard-rh"
      isSelectableRaised
      isSelected={activeSubscription?.billingModel === 'standard'}
      isDisabledRaised={!hasQuotaStandard || !isReady}
    >
      <CardTitle>Red Hat Standard</CardTitle>
      <CardBody>Fixed capacity subscription.</CardBody>
      <CardFooter>{!hasQuotaStandard && <small>Not enough quota.</small>}</CardFooter>
    </Card>
  );

  const cloudAccounts = billingQuota.marketplace?.cloudAccounts;
  const marketplaceOptions = (
    <>
      {!hideRhmAzureForNow && (
        <AddOnsSubscriptionCard
          subscriptionModels={subscriptionModels}
          setSubscriptionModel={setSubscriptionModel}
          activeCardId={activeCardId}
          hasQuota={hasQuotaMarketplace}
          isReady={isReady}
          cloudAccounts={cloudAccounts}
          installedAddOn={installedAddOn}
          billingModel="marketplace-rhm"
          name="Red Hat Marketplace"
          cloudProvider="rhm"
        />
      )}
      <AddOnsSubscriptionCard
        subscriptionModels={subscriptionModels}
        setSubscriptionModel={setSubscriptionModel}
        activeCardId={activeCardId}
        hasQuota={hasQuotaMarketplace}
        isReady={isReady}
        cloudAccounts={cloudAccounts}
        installedAddOn={installedAddOn}
        billingModel="marketplace-aws"
        name="AWS Marketplace"
        cloudProvider="aws"
      />
      {!hideRhmAzureForNow && (
        <AddOnsSubscriptionCard
          subscriptionModels={subscriptionModels}
          setSubscriptionModel={setSubscriptionModel}
          activeCardId={activeCardId}
          hasQuota={hasQuotaMarketplace}
          isReady={isReady}
          cloudAccounts={cloudAccounts}
          installedAddOn={installedAddOn}
          billingModel="marketplace-azure"
          name="Azure Marketplace"
          cloudProvider="azure"
        />
      )}
    </>
  );

  const radioStandard = (disabled = false) => (
    <Radio
      isChecked={activeSubscription?.billingModel === 'standard'}
      name="billing-model"
      id="standard"
      className="addons-radio"
      value="standard"
      label={
        <div>
          <span className={disabled ? 'pf-u-mr-xs' : ''}>Standard</span>
        </div>
      }
      isDisabled={disabled}
      onChange={() => {
        setSubscriptionModel({
          ...subscriptionModels,
          [activeCardId]: {
            addOn: activeCardId,
            billingModel: 'standard',
            cloudAccount: '',
          },
        });
      }}
    />
  );
  const radioMarketplace = (disabled = false) => (
    <Radio
      isChecked={activeSubscription?.billingModel.startsWith('marketplace')}
      name="billing-model"
      id="marketplace"
      className="addons-radio"
      value="marketplace"
      label={
        <div>
          <span className={disabled ? 'pf-u-mr-xs' : ''}>Marketplace</span>
        </div>
      }
      isDisabled={disabled}
      onChange={() => {
        setSubscriptionModel({
          ...subscriptionModels,
          [activeCardId]: {
            addOn: activeCardId,
            billingModel: 'marketplace',
            cloudAccount: installedAddOn?.billing?.billing_marketplace_account || '',
          },
        });
      }}
    />
  );
  return (
    <>
      <div
        className={billingQuota.standard && billingQuota.marketplace ? 'pf-u-mb-sm' : 'pf-u-mb-lg'}
      >
        <strong>
          <small>Subscription type</small>
        </strong>
      </div>
      {billingQuota.standard && billingQuota.marketplace && (
        <Form>
          <FormGroup role="radiogroup" isInline fieldId="billing-model-group">
            {billingQuota.standard && radioStandard(!isReady)}
            {billingQuota.marketplace && radioMarketplace(!isReady)}
          </FormGroup>
        </Form>
      )}
      {activeSubscription?.billingModel === 'standard' && standardOptions}
      {activeSubscription?.billingModel.startsWith('marketplace') && marketplaceOptions}
    </>
  );
};

export default AddOnsSubscription;
