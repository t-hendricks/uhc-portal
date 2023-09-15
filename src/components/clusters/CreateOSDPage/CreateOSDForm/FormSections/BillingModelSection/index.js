import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import { billingModels, normalizedProducts } from '../../../../../../common/subscriptionTypes';

import { availableQuota, quotaTypes } from '../../../../common/quotaSelectors';

import BillingModelSection from './BillingModelSection';

const mapStateToProps = (state) => {
  const valueSelector = formValueSelector('CreateCluster');

  const { STANDARD, MARKETPLACE } = billingModels;
  const { OSD, OSDTrial } = normalizedProducts;

  const product = valueSelector(state, 'product');

  const quotaQuery = (params) =>
    availableQuota(state.userProfile.organization.quotaList, params) > 0;

  // calculate marketplace quota for OSD even if OSDTrial was selected
  // since there is no OSDTrial on RHM
  const productForMarketplace = OSD;

  return {
    product,
    showOSDTrial: quotaQuery({
      resourceType: quotaTypes.CLUSTER,
      product: OSDTrial,
    }),

    hasStandardOSDQuota: quotaQuery({
      resourceType: quotaTypes.CLUSTER,
      product: OSD,
      billingModel: STANDARD,
    }),
    hasBYOCquota: quotaQuery({
      resourceType: quotaTypes.CLUSTER,
      billingModel: STANDARD,
      product,
      isBYOC: true,
    }),
    hasRhInfraQuota: quotaQuery({
      resourceType: quotaTypes.CLUSTER,
      billingModel: STANDARD,
      product,
      isBYOC: false,
    }),

    hasMarketplaceQuota: quotaQuery({
      resourceType: quotaTypes.CLUSTER,
      product: productForMarketplace,
      billingModel: MARKETPLACE,
    }),
    hasMarketplaceBYOCQuota: quotaQuery({
      resourceType: quotaTypes.CLUSTER,
      billingModel: MARKETPLACE,
      product: productForMarketplace,
      isBYOC: true,
    }),
    hasMarketplaceRhInfraQuota: quotaQuery({
      resourceType: quotaTypes.CLUSTER,
      billingModel: MARKETPLACE,
      product: productForMarketplace,
      isBYOC: false,
    }),
  };
};

export default connect(mapStateToProps)(BillingModelSection);
