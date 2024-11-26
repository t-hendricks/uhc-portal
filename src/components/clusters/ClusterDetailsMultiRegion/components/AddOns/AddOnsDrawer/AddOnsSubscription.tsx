import * as React from 'react';
import { useDispatch } from 'react-redux';

import {
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Form,
  FormGroup,
  Radio,
} from '@patternfly/react-core';

import { BillingQuota } from '~/components/clusters/common/quotaModel';
import { SubscriptionCommonFields } from '~/types/accounts_mgmt.v1';

import { setAddonsDrawer } from '../AddOnsActions';
import AddOnsConstants from '../AddOnsConstants';

import AddOnsSubscriptionCard from './AddOnsSubscriptionCard';
import { NO_QUOTA, SetSubscriptionModel, SubscriptionModels } from './AddOnsTypes';

const AddOnsSubscription = ({
  activeCardId,
  billingQuota,
  installedAddOn,
  subscriptionModels,
}: {
  activeCardId: string;
  billingQuota: BillingQuota;
  installedAddOn: any;
  subscriptionModels: SubscriptionModels;
}) => {
  const dispatch = useDispatch();

  const setSubscriptionModel: SetSubscriptionModel = (models) => {
    dispatch(
      // @ts-ignore -issue with dispatch type
      setAddonsDrawer({
        subscriptionModels: models,
      }),
    );
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

  const getDefaultBillingModel = ():
    | SubscriptionCommonFields.cluster_billing_model
    | typeof NO_QUOTA => {
    if (installedAddOn) {
      return installedAddOn.billing.billing_model;
    }
    if (standardNoBilling) {
      // standard subscription model not offered for this addon
      if (!hasQuotaMarketplace) {
        // marketplace subscription offered but no quota
        return NO_QUOTA;
      }
      return SubscriptionCommonFields.cluster_billing_model.MARKETPLACE;
    }
    if (marketplaceNoBilling) {
      // marketplace subscription model not offered for this addon
      if (!hasQuotaStandard) {
        // standard subscription offered but no quota
        return NO_QUOTA;
      }
      return SubscriptionCommonFields.cluster_billing_model.STANDARD;
    }
    // both standard and marketplace subscription models are offered, check quota
    if (!hasQuotaStandard) {
      if (!hasQuotaMarketplace) {
        return NO_QUOTA;
      }
      return SubscriptionCommonFields.cluster_billing_model.MARKETPLACE;
    }
    return SubscriptionCommonFields.cluster_billing_model.STANDARD;
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
      isDisabled={!hasQuotaStandard || !isReady}
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
          billingModel={SubscriptionCommonFields.cluster_billing_model.MARKETPLACE_RHM}
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
        billingModel={SubscriptionCommonFields.cluster_billing_model.MARKETPLACE_AWS}
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
          billingModel={SubscriptionCommonFields.cluster_billing_model.MARKETPLACE_AZURE}
          name="Azure Marketplace"
          cloudProvider="azure"
        />
      )}
    </>
  );

  const radioStandard = (disabled = false) => (
    <Radio
      isChecked={
        activeSubscription?.billingModel === SubscriptionCommonFields.cluster_billing_model.STANDARD
      }
      name="billing-model"
      id={SubscriptionCommonFields.cluster_billing_model.STANDARD}
      value={SubscriptionCommonFields.cluster_billing_model.STANDARD}
      label={
        <div>
          <span className={disabled ? 'pf-v5-u-mr-xs' : ''}>Standard</span>
        </div>
      }
      isDisabled={disabled}
      onChange={() => {
        setSubscriptionModel({
          ...subscriptionModels,
          [activeCardId]: {
            addOn: activeCardId,
            billingModel: SubscriptionCommonFields.cluster_billing_model.STANDARD,
            cloudAccount: '',
          },
        });
      }}
    />
  );
  const radioMarketplace = (disabled = false) => (
    <Radio
      isChecked={activeSubscription?.billingModel.startsWith(
        SubscriptionCommonFields.cluster_billing_model.MARKETPLACE,
      )}
      name="billing-model"
      id={SubscriptionCommonFields.cluster_billing_model.MARKETPLACE}
      value={SubscriptionCommonFields.cluster_billing_model.MARKETPLACE}
      label={
        <div>
          <span className={disabled ? 'pf-v5-u-mr-xs' : ''}>Marketplace</span>
        </div>
      }
      isDisabled={disabled}
      onChange={() => {
        setSubscriptionModel({
          ...subscriptionModels,
          [activeCardId]: {
            addOn: activeCardId,
            billingModel: SubscriptionCommonFields.cluster_billing_model.MARKETPLACE,
            cloudAccount: installedAddOn?.billing?.billing_marketplace_account || '',
          },
        });
      }}
    />
  );
  return (
    <>
      <div
        className={
          billingQuota.standard && billingQuota.marketplace ? 'pf-v5-u-mb-sm' : 'pf-v5-u-mb-lg'
        }
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
      {activeSubscription?.billingModel ===
        SubscriptionCommonFields.cluster_billing_model.STANDARD && standardOptions}
      {activeSubscription?.billingModel.startsWith(
        SubscriptionCommonFields.cluster_billing_model.MARKETPLACE,
      ) && marketplaceOptions}
    </>
  );
};

export default AddOnsSubscription;
