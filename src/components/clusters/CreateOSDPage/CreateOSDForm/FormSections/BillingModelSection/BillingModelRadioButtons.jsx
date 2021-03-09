import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  FormGroup, Title,
} from '@patternfly/react-core';

import { billingModels } from '../../../../../../common/subscriptionTypes';
import FlatRadioButton from '../../../../../common/FlatRadioButton';
import RadioButtons from '../../../../../common/ReduxFormComponents/RadioButtons';
import { billingModelConstants } from '../../CreateOSDFormConstants';
import { noQuotaTooltip } from '../../../../../../common/helpers';
import './BillingModelRadioButtons.scss';

function BillingModelRadioButtons({
  hasBYOCquota,
  hasStandardQuota,
  hasMarketplaceBYOCQuota,
  hasMarketplaceRhInfraQuota,
  input: { onChange },
  byocSelected,
  showMarketplace,
  pending,
  toggleSubscriptionBilling,
  billingModel,
}) {
  const {
    standard,
    standardText,
    customerCloudSubscription,
    customerCloudSubscriptionText,
  } = billingModelConstants;

  const hasMarketplaceSubscription = hasMarketplaceBYOCQuota || hasMarketplaceRhInfraQuota;
  const hasStandardSubscription = hasBYOCquota || hasStandardQuota;

  let isStandardQuotaDisabled;
  let isBYOCQuotaDisabled;
  if (billingModel === billingModels.STANDARD) {
    isStandardQuotaDisabled = !hasStandardQuota;
    isBYOCQuotaDisabled = !hasBYOCquota;
  } else {
    isStandardQuotaDisabled = !hasMarketplaceRhInfraQuota;
    isBYOCQuotaDisabled = !hasMarketplaceBYOCQuota;
  }

  const subscriptionOptions = [
    {
      disabled: !hasStandardSubscription,
      value: 'standard',
      ariaLabel: 'Standard',
      label: 'Red Hat subscriptions (pre-paid)',
      description: 'Use the quota pre-purchased by your organization',
    },
  ];

  if (showMarketplace) {
    subscriptionOptions.push(
      {
        disabled: !hasMarketplaceSubscription,
        value: 'marketplace',
        ariaLabel: 'Marketplace',
        label: 'Consumption billing via the Red Hat Marketplace',
        description: 'Use Red Hat Marketplace to subscribe and pay based on the services you use',
      },
    );
  }

  return (
    <>
      {showMarketplace && (
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
              defaultValue={billingModel}
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
  hasMarketplaceBYOCQuota: PropTypes.bool.isRequired,
  hasMarketplaceRhInfraQuota: PropTypes.bool.isRequired,
  input: PropTypes.shape({ onChange: PropTypes.func.isRequired }).isRequired,
  byocSelected: PropTypes.bool,
  showMarketplace: PropTypes.bool,
  pending: PropTypes.bool,
  toggleSubscriptionBilling: PropTypes.func.isRequired,
  billingModel: PropTypes.oneOf(Object.values(billingModels)).isRequired,
};

export default BillingModelRadioButtons;
