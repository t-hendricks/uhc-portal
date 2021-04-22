import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  FormGroup, Title,
} from '@patternfly/react-core';

import { billingModels, normalizedProducts } from '../../../../../../common/subscriptionTypes';
import FlatRadioButton from '../../../../../common/FlatRadioButton';
import RadioButtons from '../../../../../common/ReduxFormComponents/RadioButtons';
import { billingModelConstants } from '../../CreateOSDFormConstants';
import { noQuotaTooltip } from '../../../../../../common/helpers';
import './BillingModelRadioButtons.scss';

function BillingModelRadioButtons({
  hasBYOCquota,
  hasStandardQuota,
  hasStandardOSDQuota,
  hasMarketplaceBYOCQuota,
  hasMarketplaceRhInfraQuota,
  input: { onChange },
  byocSelected,
  showOSDTrial,
  showMarketplace,
  pending,
  toggleSubscriptionBilling,
  billingModel,
  product,
}) {
  const {
    standard,
    standardText,
    customerCloudSubscription,
    customerCloudSubscriptionText,
  } = billingModelConstants;
  const { STANDARD } = billingModels;

  const showSubscriptionType = showOSDTrial || showMarketplace;
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
  if (showMarketplace && !hasStandardOSDQuota && hasMarketplaceSubscription) {
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
        description: 'Try OpenShift Dedicated for free for 60 days. Upgrade anytime',
      },
    );
  }

  if (showMarketplace) {
    subscriptionOptions.push(
      {
        disabled: !hasMarketplaceSubscription,
        value: 'marketplace',
        ariaLabel: 'Marketplace',
        label: 'On-demand: Flexible usage billed through the Red Hat Marketplace',
        description: 'Use Red Hat Marketplace to subscribe and pay based on the services you use',
      },
    );
  }

  return (
    <>
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
      <div id="billing-model" className="flat-radio-buttons-flex-container">
        <FlatRadioButton
          id={standard.toLowerCase()}
          value="false"
          isSelected={!byocSelected}
          titleText={standard}
          secondaryText={standardText}
          isDisabled={isStandardQuotaDisabled}
          onChange={onChange}
          tooltip={isStandardQuotaDisabled && noQuotaTooltip}
        />
        <FlatRadioButton
          id={customerCloudSubscription.toLowerCase()}
          value="true"
          isSelected={!isBYOCQuotaDisabled && byocSelected}
          titleText={customerCloudSubscription}
          secondaryText={customerCloudSubscriptionText}
          onChange={onChange}
          isDisabled={isBYOCQuotaDisabled}
          tooltip={isBYOCQuotaDisabled && noQuotaTooltip}
        />
      </div>
    </>
  );
}

BillingModelRadioButtons.defaultProps = {
  byocSelected: false,
  showMarketplace: false,
};

BillingModelRadioButtons.propTypes = {
  hasBYOCquota: PropTypes.bool.isRequired,
  hasStandardQuota: PropTypes.bool.isRequired,
  hasStandardOSDQuota: PropTypes.bool.isRequired,
  hasMarketplaceBYOCQuota: PropTypes.bool.isRequired,
  hasMarketplaceRhInfraQuota: PropTypes.bool.isRequired,
  input: PropTypes.shape({ onChange: PropTypes.func.isRequired }).isRequired,
  byocSelected: PropTypes.bool,
  showOSDTrial: PropTypes.bool,
  showMarketplace: PropTypes.bool,
  pending: PropTypes.bool,
  toggleSubscriptionBilling: PropTypes.func.isRequired,
  billingModel: PropTypes.oneOf(Object.values(billingModels)).isRequired,
  product: PropTypes.oneOf(Object.keys(normalizedProducts)).isRequired,
};

export default BillingModelRadioButtons;
