import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Field } from 'redux-form';

import {
  FormGroup,
  GridItem,
  Stack,
  StackItem,
  Text,
  Title,
} from '@patternfly/react-core';

import RadioButtons from '../../../../../common/ReduxFormComponents/RadioButtons';
import ExternalLink from '../../../../../common/ExternalLink';

import { normalizedProducts, billingModels } from '../../../../../../common/subscriptionTypes';

import CreateOSDWizardIntro from '../../../../../../styles/images/CreateOSDWizard-intro.png';

import BillingModelRadioButtons from './BillingModelRadioButtons';

function BillingModelSection({
  hasBYOCquota,
  hasRhInfraQuota,
  hasStandardOSDQuota,
  hasMarketplaceBYOCQuota,
  hasMarketplaceRhInfraQuota,
  hasMarketplaceQuota,
  toggleBYOCFields,
  byocSelected = false,
  showOSDTrial,
  pending,
  toggleSubscriptionBilling,
  product,
  billingModel,
  isWizard,
  change,
}) {
  const { STANDARD } = billingModels;

  const marketplaceQuotaDescription = (
    <p>
      Use
      {' '}
      <Link to="/quota/resource-limits">
        Red Hat Marketplace
      </Link>
      {' '}
      to subscribe and pay based on the services you use
    </p>
  );

  const trialDescription = (
    <p>
      <ExternalLink href="https://access.redhat.com/articles/5990101" noIcon noTarget>
        Try OpenShift Dedicated
      </ExternalLink>
      {' '}
      for free for 60 days. Upgrade anytime
    </p>
  );

  let defaultBillingModel = !billingModel ? STANDARD : billingModel;
  if (product === normalizedProducts.OSDTrial) {
    defaultBillingModel = 'standard-trial';
  }

  const hasMarketplaceSubscription = hasMarketplaceBYOCQuota || hasMarketplaceRhInfraQuota;

  // Select marketplace billing if user only has marketplace quota
  // Also, if the selected default billing model is disabled
  // Default to marketplace
  if ((!showOSDTrial || defaultBillingModel === STANDARD)
  && hasMarketplaceQuota && !hasStandardOSDQuota && hasMarketplaceSubscription) {
    defaultBillingModel = billingModels.MARKETPLACE;
  }

  let isRhInfraQuotaDisabled;
  let isBYOCQuotaDisabled;
  if (defaultBillingModel === STANDARD || defaultBillingModel === 'standard-trial') {
    isRhInfraQuotaDisabled = !hasRhInfraQuota;
    isBYOCQuotaDisabled = !hasBYOCquota;
  } else {
    isRhInfraQuotaDisabled = !hasMarketplaceRhInfraQuota;
    isBYOCQuotaDisabled = !hasMarketplaceBYOCQuota;
  }

  const onBillingModelChange = (_, value) => {
    let selectedProduct;
    if (value === 'standard-trial') {
      selectedProduct = normalizedProducts.OSDTrial;
      if (isWizard) {
        // Wizard has no byoc modal so this change must happen here
        change('byoc', 'true');
      }
    } else {
      selectedProduct = normalizedProducts.OSD;
    }
    change('product', selectedProduct);
    if (toggleSubscriptionBilling) {
      toggleSubscriptionBilling(_, value);
    }
  };

  const subscriptionOptions = [
    {
      disabled: !hasStandardOSDQuota,
      value: billingModels.STANDARD,
      label: 'Annual: Fixed capacity subscription from Red Hat',
      description: 'Use the quota pre-purchased by your organization',
    },
  ];

  if (showOSDTrial) {
    subscriptionOptions.unshift(
      {
        value: 'standard-trial',
        label: 'Free trial (upgradeable)',
        // 60 days may be updated later based on an account capability
        // https://issues.redhat.com/browse/SDB-1846
        description: trialDescription,
      },
    );
  }

  if (hasMarketplaceQuota) {
    subscriptionOptions.push(
      {
        disabled: !hasMarketplaceSubscription,
        value: billingModels.MARKETPLACE,
        label: 'On-demand: Flexible usage billed through the Red Hat Marketplace',
        description: marketplaceQuotaDescription,
      },
    );
  }

  return (
    <>
      { isWizard && (
        <>
          <GridItem span={8}>
            <Title headingLevel="h2">Welcome to Red Hat OpenShift Dedicated</Title>
            <Text component="p" id="welcome-osd-text">
              Reduce operational complexity and focus on building applications
              that add more value to your business with Red Hat OpenShift Dedicated,
              a fully managed service of Red Hat OpenShift on
              Amazon Web Services (AWS) and Google Cloud.
            </Text>
          </GridItem>
          <GridItem span={4}>
            <img src={CreateOSDWizardIntro} className="ocm-c-wizard-intro-image" aria-hidden="true" alt="" />
          </GridItem>
        </>
      )}
      <GridItem span={12}>
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h3">Subscription type:</Title>
            <FormGroup
              isRequired
              fieldId="billing_model"
              className="sub-infra-billing-model"
            >
              <Field
                component={RadioButtons}
                name="billing_model"
                className="radio-button"
                disabled={pending}
                onChange={onBillingModelChange}
                options={subscriptionOptions}
                defaultValue={defaultBillingModel}
                disableDefaultValueHandling={isWizard}
              />
            </FormGroup>
          </StackItem>
          <StackItem>
            <Title headingLevel="h3">Infrastructure type:</Title>
            <FormGroup
              isRequired
              fieldId="byoc"
              className="sub-infra-billing-model"
            >
              { isWizard
                ? (
                  <Field
                    component={RadioButtons}
                    name="byoc"
                    className="radio-button"
                    defaultValue={!isRhInfraQuotaDisabled ? 'false' : 'true'}
                    disableDefaultValueHandling
                    options={[{
                      label: 'Customer cloud subscription',
                      description: 'Leverage your existing cloud provider account (AWS or Google Cloud)',
                      value: 'true',
                      disabled: isBYOCQuotaDisabled,
                    },
                    {
                      label: 'Red Hat cloud account',
                      description: 'Deploy in cloud provider accounts owned by Red Hat',
                      value: 'false',
                      disabled: isRhInfraQuotaDisabled,
                    }]}
                    onChange={toggleBYOCFields}
                  />
                )
                : (
                  <Field
                    component={BillingModelRadioButtons}
                    name="byoc"
                    isBYOCQuotaDisabled={isBYOCQuotaDisabled}
                    isRhInfraQuotaDisabled={isRhInfraQuotaDisabled}
                    byocSelected={byocSelected}
                    onChange={toggleBYOCFields}
                  />
                )}
            </FormGroup>
          </StackItem>
        </Stack>
      </GridItem>
    </>
  );
}

BillingModelSection.propTypes = {
  hasBYOCquota: PropTypes.bool.isRequired,
  hasRhInfraQuota: PropTypes.bool.isRequired,
  hasStandardOSDQuota: PropTypes.bool.isRequired,
  hasMarketplaceQuota: PropTypes.bool,
  hasMarketplaceBYOCQuota: PropTypes.bool,
  hasMarketplaceRhInfraQuota: PropTypes.bool,
  toggleBYOCFields: PropTypes.func,
  byocSelected: PropTypes.bool,
  showOSDTrial: PropTypes.bool,
  pending: PropTypes.bool,
  toggleSubscriptionBilling: PropTypes.func,
  product: PropTypes.oneOf(Object.keys(normalizedProducts)).isRequired,
  billingModel: PropTypes.oneOf(Object.values(billingModels)),
  isWizard: PropTypes.bool,
  change: PropTypes.func.isRequired,
};

export default BillingModelSection;
