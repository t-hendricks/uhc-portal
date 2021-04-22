import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import {
  FormGroup,
  GridItem,
} from '@patternfly/react-core';

import { normalizedProducts, billingModels } from '../../../../../../common/subscriptionTypes';
import BillingModelRadioButtons from './BillingModelRadioButtons';

function BillingModelSection({
  hasBYOCquota,
  hasStandardQuota,
  hasStandardOSDQuota,
  hasMarketplaceBYOCQuota,
  hasMarketplaceRhInfraQuota,
  openModal,
  toggleBYOCFields,
  byocSelected = false,
  showOSDTrial,
  pending,
  toggleSubscriptionBilling,
  product,
  hasMarketplaceQuota,
  billingModel,
}) {
  return (
    <GridItem span={12}>
      <FormGroup
        isRequired
        fieldId="billing_model"
      >
        <Field
          component={BillingModelRadioButtons}
          name="byoc"
          hasBYOCquota={hasBYOCquota}
          hasStandardQuota={hasStandardQuota}
          hasStandardOSDQuota={hasStandardOSDQuota}
          hasMarketplaceBYOCQuota={hasMarketplaceBYOCQuota}
          hasMarketplaceRhInfraQuota={hasMarketplaceRhInfraQuota}
          byocSelected={byocSelected}
          openModal={openModal}
          onChange={toggleBYOCFields}
          showOSDTrial={showOSDTrial}
          pending={pending}
          toggleSubscriptionBilling={toggleSubscriptionBilling}
          product={product}
          showMarketplace={hasMarketplaceQuota}
          billingModel={billingModel}
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
  openModal: PropTypes.func.isRequired,
  toggleBYOCFields: PropTypes.func.isRequired,
  byocSelected: PropTypes.bool,
  showOSDTrial: PropTypes.bool,
  pending: PropTypes.bool,
  toggleSubscriptionBilling: PropTypes.func.isRequired,
  product: PropTypes.oneOf(Object.keys(normalizedProducts)).isRequired,
  billingModel: PropTypes.oneOf(Object.values(billingModels)),
};

export default BillingModelSection;
