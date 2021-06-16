import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Field } from 'redux-form';

import {
  FormGroup,
  GridItem,
  Text,
  Title,
} from '@patternfly/react-core';

import RadioButtons from '../../../../../common/ReduxFormComponents/RadioButtons';
import ExternalLink from '../../../../../common/ExternalLink';

import { normalizedProducts, billingModels } from '../../../../../../common/subscriptionTypes';

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

  let isRhInfraQuotaDisabled;
  let isBYOCQuotaDisabled;
  if (defaultBillingModel === STANDARD || defaultBillingModel === 'standard-trial') {
    isRhInfraQuotaDisabled = !hasRhInfraQuota;
    isBYOCQuotaDisabled = !hasBYOCquota;
  } else {
    isRhInfraQuotaDisabled = !hasMarketplaceRhInfraQuota;
    isBYOCQuotaDisabled = !hasMarketplaceBYOCQuota;
  }

  // Select marketplace billing if user only has marketplace quota
  if (hasMarketplaceQuota && !hasStandardOSDQuota && hasMarketplaceSubscription) {
    defaultBillingModel = billingModels.MARKETPLACE;
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

  const showSubscriptionType = subscriptionOptions.length > 1;

  return (
    <GridItem span={12}>
      { isWizard && (
        <>
          <Title headingLevel="h2">Welcome to Red Hat OpenShift Dedicated</Title>
          <Text component="p">
            Reduce operational complexity and focus on building applications
            that add more value to your business with Red Hat OpenShift Dedicated,
            a fully managed service of Red Hat OpenShift on
            Amazon Web Services (AWS) and Google Cloud.
          </Text>
        </>
      )}
      {showSubscriptionType && (
        <>
          <Title headingLevel="h3">Subscription type:</Title>
          <FormGroup
            isRequired
            fieldId="billing_model"
            id="subscription-billing-model"
          >
            <Field
              component={RadioButtons}
              name="billing_model"
              className="radio-button"
              disabled={pending}
              onChange={onBillingModelChange}
              options={subscriptionOptions}
              defaultValue={defaultBillingModel}
            />
          </FormGroup>
          <Title headingLevel="h3">Infrastructure type:</Title>
        </>
      )}
      <FormGroup
        isRequired
        fieldId="byoc"
      >
        { isWizard
          ? (
            <Field
              component={RadioButtons}
              name="byoc"
              defaultValue="false"
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
    </GridItem>
  );
}

BillingModelSection.propTypes = {
  hasBYOCquota: PropTypes.bool.isRequired,
  hasRhInfraQuota: PropTypes.bool.isRequired,
  hasStandardOSDQuota: PropTypes.bool.isRequired,
  hasMarketplaceQuota: PropTypes.bool,
  hasMarketplaceBYOCQuota: PropTypes.bool,
  hasMarketplaceRhInfraQuota: PropTypes.bool,
  toggleBYOCFields: PropTypes.func.isRequired,
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
