import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Field } from 'redux-form';

import {
  FormGroup,
  GridItem,
  Title,
} from '@patternfly/react-core';

import RadioButtons from '../../../../../common/ReduxFormComponents/RadioButtons';
import ExternalLink from '../../../../../common/ExternalLink';

import { normalizedProducts, billingModels } from '../../../../../../common/subscriptionTypes';

import BillingModelRadioButtons from './BillingModelRadioButtons';

function BillingModelSection({
  hasBYOCquota,
  hasStandardQuota,
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

  const showSubscriptionType = showOSDTrial || hasMarketplaceQuota;
  let defaultBillingModel = !billingModel ? STANDARD : billingModel;
  if (product === normalizedProducts.OSDTrial) {
    defaultBillingModel = 'standard-trial';
  }

  const hasMarketplaceSubscription = hasMarketplaceBYOCQuota || hasMarketplaceRhInfraQuota;

  let isStandardQuotaDisabled;
  let isBYOCQuotaDisabled;
  if (defaultBillingModel.split('-')[0] === STANDARD) {
    isStandardQuotaDisabled = !hasStandardQuota;
    isBYOCQuotaDisabled = !hasBYOCquota;
  } else {
    isStandardQuotaDisabled = !hasMarketplaceRhInfraQuota;
    isBYOCQuotaDisabled = !hasMarketplaceBYOCQuota;
  }

  // Select marketplace billing if user only has marketplace quota
  if (hasMarketplaceQuota && !hasStandardOSDQuota && hasMarketplaceSubscription) {
    defaultBillingModel = 'marketplace';
  }

  const subscriptionOptions = [
    {
      disabled: !hasStandardOSDQuota,
      value: 'standard',
      ariaLabel: 'Standard',
      label: 'Annual: Fixed capacity subscription from Red Hat',
      description: 'Use the quota pre-purchased by your organization',
    },
  ];

  if (showOSDTrial) {
    subscriptionOptions.unshift(
      {
        value: 'standard-trial',
        ariaLabel: 'OSD Trial',
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
        value: 'marketplace',
        ariaLabel: 'Marketplace',
        label: 'On-demand: Flexible usage billed through the Red Hat Marketplace',
        description: marketplaceQuotaDescription,
      },
    );
  }

  return (
    <GridItem span={12}>
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
              onChange={toggleSubscriptionBilling}
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
        <Field
          component={BillingModelRadioButtons}
          name="byoc"
          isBYOCQuotaDisabled={isBYOCQuotaDisabled}
          isStandardQuotaDisabled={isStandardQuotaDisabled}
          byocSelected={byocSelected}
          onChange={toggleBYOCFields}
        />
      </FormGroup>
    </GridItem>
  );
}

BillingModelSection.propTypes = {
  hasBYOCquota: PropTypes.bool.isRequired,
  hasStandardQuota: PropTypes.bool.isRequired,
  hasStandardOSDQuota: PropTypes.bool.isRequired,
  hasMarketplaceQuota: PropTypes.bool,
  hasMarketplaceBYOCQuota: PropTypes.bool,
  hasMarketplaceRhInfraQuota: PropTypes.bool,
  toggleBYOCFields: PropTypes.func.isRequired,
  byocSelected: PropTypes.bool,
  showOSDTrial: PropTypes.bool,
  pending: PropTypes.bool,
  toggleSubscriptionBilling: PropTypes.func.isRequired,
  product: PropTypes.oneOf(Object.keys(normalizedProducts)).isRequired,
  billingModel: PropTypes.oneOf(Object.values(billingModels)),
};

export default BillingModelSection;
