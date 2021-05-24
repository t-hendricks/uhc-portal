import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import { OSD_TRIAL_FEATURE } from '../../../../../../redux/constants/featureConstants';

import { billingModels, normalizedProducts } from '../../../../../../common/subscriptionTypes';

import {
  availableQuota,
  quotaTypes,
} from '../../../../common/quotaSelectors';

import BillingModelSection from './BillingModelSection';

const mapStateToProps = (state, ownProps) => {
  const valueSelector = formValueSelector('CreateCluster');

  const { cloudProviderID, isWizard } = ownProps;
  const { STANDARD, MARKETPLACE } = billingModels;
  const { OSD, OSDTrial } = normalizedProducts;

  const product = valueSelector(state, 'product');

  const queryCloudProvider = isWizard ? 'any' : cloudProviderID;

  const quotaQuery = params => availableQuota(state.userProfile.organization.quotaList, params) > 0;

  return {
    product,
    showOSDTrial: state.features[OSD_TRIAL_FEATURE] && quotaQuery({
      resourceType: quotaTypes.CLUSTER,
      product: OSDTrial,
    }),

    hasStandardOSDQuota: quotaQuery({
      resourceType: quotaTypes.CLUSTER,
      product: OSD,
      billingModel: STANDARD,
    }),
    hasMarketplaceQuota: quotaQuery({
      resourceType: quotaTypes.CLUSTER,
      // calculate marketplace quota for OSD even if OSDTrial was selected
      // since there is no OSDTrial on RHM
      product: OSD,
      billingModel: MARKETPLACE,
    }),
    hasBYOCquota: quotaQuery(
      {
        resourceType: quotaTypes.CLUSTER,
        cloudProviderID: queryCloudProvider,
        billingModel: STANDARD,
        product,
        isBYOC: true,
      },
    ),
    hasRhInfraQuota: quotaQuery(
      {
        resourceType: quotaTypes.CLUSTER,
        cloudProviderID: queryCloudProvider,
        billingModel: STANDARD,
        product,
        isBYOC: false,
      },
    ),
    hasMarketplaceBYOCQuota: quotaQuery(
      {
        resourceType: quotaTypes.CLUSTER,
        cloudProviderID: queryCloudProvider,
        billingModel: MARKETPLACE,
        product: OSD,
        isBYOC: true,
      },
    ),
    hasMarketplaceRhInfraQuota: quotaQuery(
      {
        resourceType: quotaTypes.CLUSTER,
        cloudProviderID: queryCloudProvider,
        billingModel: MARKETPLACE,
        product: OSD,
        isBYOC: false,
      },
    ),
  };
};

export default connect(mapStateToProps)(BillingModelSection);
