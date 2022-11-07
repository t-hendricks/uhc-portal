import * as React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Form,
  FormGroup,
  Radio,
  Popover,
} from '@patternfly/react-core';
import InfoCircleIcon from '@patternfly/react-icons/dist/esm/icons/info-circle-icon';
import { noQuotaTooltip } from '~/common/helpers';
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

  const getInfo = (option: 'standard' | 'marketplace') => {
    if (!billingQuota[option]) {
      const content = {
        standard: 'This addon is not available through Red Hat standard billing.',
        marketplace: 'This addon is not available through Marketplace.',
      };
      return (
        <Popover headerContent="Not supported" bodyContent={content[option]}>
          <Button
            variant="plain"
            className="info-button"
            icon={<InfoCircleIcon className="info-icon" />}
            aria-label="Not supported"
          />
        </Popover>
      );
    }
    if (!hasQuotaStandard || !hasQuotaMarketplace) {
      return (
        <Popover headerContent="Not enough quota" bodyContent={noQuotaTooltip}>
          <Button
            variant="plain"
            className="info-button"
            icon={<InfoCircleIcon className="info-icon" />}
            aria-label="Not enough quota"
          />
        </Popover>
      );
    }
    return null;
  };

  const standardAvailable = !standardNoBilling && hasQuotaStandard;
  const marketplaceAvailable = !marketplaceNoBilling && hasQuotaMarketplace;

  const radioStandard = (disabled = false) => (
    <Radio
      isChecked={activeSubscription?.billingModel === 'standard' && standardAvailable}
      name="billing-model"
      id="standard"
      className="addons-radio"
      value="standard"
      label={
        <div>
          <span className={disabled ? 'pf-u-mr-xs' : ''}>Standard</span>
          {disabled && getInfo('standard')}
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
      isChecked={activeSubscription?.billingModel.startsWith('marketplace') && marketplaceAvailable}
      name="billing-model"
      id="marketplace"
      className="addons-radio"
      value="marketplace"
      label={
        <div>
          <span className={disabled ? 'pf-u-mr-xs' : ''}>Marketplace</span>
          {disabled && getInfo('marketplace')}
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
      <div className="pf-u-mb-sm">
        <strong>
          <small>Subscription model</small>
        </strong>
      </div>
      <p>Choose how you would like to pay for this subscription.</p>
      <Form>
        <FormGroup role="radiogroup" isInline fieldId="billing-model-group">
          {radioStandard(standardNoBilling || !hasQuotaStandard || !isReady)}
          {radioMarketplace(marketplaceNoBilling || !hasQuotaMarketplace || !isReady)}
        </FormGroup>
      </Form>
      {activeSubscription?.billingModel === 'standard' && standardAvailable && standardOptions}
      {activeSubscription?.billingModel.startsWith('marketplace') &&
        marketplaceAvailable &&
        marketplaceOptions}
    </>
  );
};

export default AddOnsSubscription;
