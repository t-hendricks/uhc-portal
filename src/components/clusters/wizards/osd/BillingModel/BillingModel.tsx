import React from 'react';

import {
  Title,
  Text,
  Stack,
  StackItem,
  Flex,
  FlexItem,
  Popover,
  PopoverPosition,
  Button,
} from '@patternfly/react-core';
import OutlinedQuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon';

import CreateOSDWizardIntro from '~/styles/images/CreateOSDWizard-intro.png';
import { OSD_GOOGLE_MARKETPLACE_FEATURE } from '~/redux/constants/featureConstants';
import { billingModels, normalizedProducts } from '~/common/subscriptionTypes';
import ExternalLink from '~/components/common/ExternalLink';
import {
  getMinReplicasCount,
  getNodesCount,
} from '~/components/clusters/CreateOSDPage/CreateOSDForm/FormSections/ScaleSection/AutoScaleSection/AutoScaleHelper';
import { FieldId } from '~/components/clusters/wizards/osd/constants';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { RadioGroupField, RadioGroupOption } from '~/components/clusters/wizards/form';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import { useGetBillingQuotas } from './useGetBillingQuotas';
import { MarketplaceSelectField } from './MarketplaceSelectField';

import './BillingModel.scss';

export const BillingModel = () => {
  const {
    values: {
      [FieldId.Product]: product,
      [FieldId.BillingModel]: billingModel,
      [FieldId.MarketplaceSelection]: selectedMarketplace,
    },
    values,
    setFieldValue,
  } = useFormState();

  const quotas = useGetBillingQuotas({ product });
  const osdGoogleMarketplaceFeature = useFeatureGate(OSD_GOOGLE_MARKETPLACE_FEATURE);
  const showOsdTrial = quotas.osdTrial;

  const trialDescription = (
    <p>
      <ExternalLink href="https://access.redhat.com/articles/5990101" noIcon noTarget>
        Try OpenShift Dedicated
      </ExternalLink>{' '}
      for free for 60 days. Upgrade anytime
    </p>
  );

  const marketplaceQuotaDescription = osdGoogleMarketplaceFeature ? (
    <>
      {selectedMarketplace === billingModels.MARKETPLACE && (
        <p>Use Red Hat Marketplace to subscribe and pay based on the services you use</p>
      )}
      {selectedMarketplace === billingModels.MARKETPLACE_GCP && (
        <p>Use Google Cloud Marketplace to subscribe and pay based on the services you use</p>
      )}
      {!(selectedMarketplace === billingModels.MARKETPLACE) &&
        !(selectedMarketplace === billingModels.MARKETPLACE_GCP) && (
          <p>Use your cloud marketplace to subscribe and pay based on the services you use</p>
        )}
    </>
  ) : (
    <p>
      Use{' '}
      <ExternalLink href="https://marketplace.redhat.com" noIcon>
        Red Hat Marketplace
      </ExternalLink>{' '}
      to subscribe and pay based on the services you use
    </p>
  );

  const rhmLink = (
    <ExternalLink
      href="https://marketplace.redhat.com/en-us/products/red-hat-openshift-dedicated"
      noIcon
    >
      Red Hat Marketplace
    </ExternalLink>
  );

  const gcpLink = (
    <ExternalLink
      href="https://console.cloud.google.com/marketplace/product/redhat-marketplace/red-hat-openshift-container-platform-prod?project=solar-program-335223&pli=1"
      noIcon
    >
      Google Cloud
    </ExternalLink>
  );

  const marketplaceDisabledDescription = (
    <>
      {marketplaceQuotaDescription}
      <p>
        <Popover
          position={PopoverPosition.right}
          headerContent="On-Demand subscription"
          bodyContent={
            osdGoogleMarketplaceFeature ? (
              <p>
                Billing based on cluster consumption. Purchase a subscription via {rhmLink} or{' '}
                {gcpLink}
              </p>
            ) : (
              <>
                <p>Billing based on cluster consumption and charged via Red Hat Marketplace.</p>
                <p>
                  <ExternalLink href="https://marketplace.redhat.com/en-us/products/red-hat-openshift-dedicated">
                    Purchase this option
                  </ExternalLink>
                </p>
              </>
            )
          }
          aria-label="help"
        >
          <Button variant="link">
            <OutlinedQuestionCircleIcon />{' '}
            {osdGoogleMarketplaceFeature
              ? 'How can I purchase a subscription?'
              : 'How can I purchase a subscription via Marketplace?'}
          </Button>
        </Popover>
      </p>
    </>
  );

  const subOptions = [
    ...(showOsdTrial
      ? [
          {
            value: billingModels.STANDARD_TRIAL,
            label: 'Free trial (upgradeable)',
            // 60 days may be updated later based on an account capability
            // https://issues.redhat.com/browse/SDB-1846
            description: trialDescription,
          },
        ]
      : []),
    {
      disabled: !quotas.standardOsd,
      value: billingModels.STANDARD,
      label: 'Annual: Fixed capacity subscription from Red Hat',
      description: 'Use the quota pre-purchased by your organization',
    },
    ...(osdGoogleMarketplaceFeature
      ? [
          {
            disabled: !quotas.marketplace && !quotas.gcpResources,
            value: 'marketplace-select',
            // check the radio button if billingModel starts with 'marketplace'
            shouldCheck: (fieldValue: string, radioValue: React.ReactText) =>
              fieldValue.startsWith('marketplace') && `${radioValue}` === 'marketplace-select',
            label: (
              <>
                <div>
                  On-Demand: Flexible usage billed through {gcpLink} or {rhmLink}
                </div>
                <MarketplaceSelectField
                  hasGcpQuota={quotas.gcpResources}
                  hasRhmQuota={quotas.marketplace}
                />
              </>
            ),
            description:
              !quotas.marketplace && !quotas.gcpResources
                ? marketplaceDisabledDescription
                : marketplaceQuotaDescription,
          },
        ]
      : [
          {
            disabled: !quotas.marketplace,
            value: billingModels.MARKETPLACE,
            label: 'On-Demand: Flexible usage billed through the Red Hat Marketplace',
            description: !quotas.marketplace
              ? marketplaceDisabledDescription
              : marketplaceQuotaDescription,
          },
        ]),
  ];

  React.useEffect(() => {
    if (product === normalizedProducts.OSDTrial) {
      if (showOsdTrial) {
        setFieldValue(FieldId.BillingModel, billingModels.STANDARD_TRIAL);
        setFieldValue(FieldId.Byoc, 'true');
      } else {
        setFieldValue(FieldId.Product, normalizedProducts.OSD);
      }
    }

    // Select marketplace billing if user only has marketplace quota
    // Also, if the selected default billing model is disabled
    // Default to marketplace
    if (
      (!showOsdTrial || billingModel === billingModels.STANDARD) &&
      quotas.marketplace &&
      !quotas.standardOsd
    ) {
      setFieldValue(FieldId.BillingModel, billingModels.MARKETPLACE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, billingModel, showOsdTrial, quotas.marketplace, quotas.standardOsd]);

  let isRhInfraQuotaDisabled = false;
  let isByocQuotaDisabled = false;

  if (billingModel.startsWith(billingModels.MARKETPLACE)) {
    isRhInfraQuotaDisabled = !quotas.marketplaceRhInfra;
    isByocQuotaDisabled = !quotas.marketplaceByoc;
  } else {
    isRhInfraQuotaDisabled = !quotas.rhInfra;
    isByocQuotaDisabled = !quotas.byoc;
  }

  const infraOptions: RadioGroupOption[] = [
    {
      label: 'Customer cloud subscription',
      description: osdGoogleMarketplaceFeature
        ? 'Leverage your existing cloud provider account'
        : 'Leverage your existing cloud provider account (AWS or Google Cloud)',
      value: 'true',
      disabled: isByocQuotaDisabled,
    },
    {
      label: 'Red Hat cloud account',
      description: 'Deploy in cloud provider accounts owned by Red Hat',
      value: 'false',
      disabled: isRhInfraQuotaDisabled,
    },
  ];

  const onBillingModelChange = (value: string) => {
    let selectedProduct = normalizedProducts.OSD;

    if (value !== billingModels.STANDARD) {
      setFieldValue(FieldId.Byoc, 'true');
    }

    if (value === billingModels.STANDARD_TRIAL) {
      selectedProduct = normalizedProducts.OSDTrial;
    }

    setFieldValue(FieldId.Product, selectedProduct);
  };

  const onByocChange = (value: string) => {
    const isBYOC = value === 'true';
    const isMultiAz = values[FieldId.MultiAz] === 'true';

    setFieldValue(FieldId.NodesCompute, getNodesCount(isBYOC, isMultiAz, true));
    setFieldValue(FieldId.MinReplicas, getMinReplicasCount(isBYOC, isMultiAz, true));
    setFieldValue(FieldId.MaxReplicas, '');
  };

  return (
    <Flex alignItems={{ default: 'alignItemsFlexStart' }}>
      <FlexItem flex={{ default: 'flex_3' }}>
        <Stack hasGutter>
          <StackItem className="pf-u-mb-xl">
            <Title headingLevel="h2" className="pf-u-pb-md">
              Welcome to Red Hat OpenShift Dedicated
            </Title>
            <Text component="p" id="welcome-osd-text">
              Reduce operational complexity and focus on building applications that add more value
              to your business with Red Hat OpenShift Dedicated, a fully managed service of Red Hat
              OpenShift on Amazon Web Services (AWS) and Google Cloud.
            </Text>
          </StackItem>

          <StackItem>
            <Title headingLevel="h3" className="pf-u-mb-sm">
              Subscription type
            </Title>
            <RadioGroupField
              name={FieldId.BillingModel}
              options={subOptions}
              onChange={onBillingModelChange}
            />
          </StackItem>

          <StackItem>
            <Title headingLevel="h3" className="pf-u-mb-sm">
              Infrastructure type
            </Title>

            <RadioGroupField name={FieldId.Byoc} options={infraOptions} onChange={onByocChange} />
          </StackItem>
        </Stack>
      </FlexItem>

      <FlexItem flex={{ default: 'flex_1' }}>
        <img
          src={CreateOSDWizardIntro}
          className="billing-model_osd-logo"
          aria-hidden="true"
          alt=""
        />
      </FlexItem>
    </Flex>
  );
};
