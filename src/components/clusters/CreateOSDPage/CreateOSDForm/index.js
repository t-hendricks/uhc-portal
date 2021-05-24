import { connect } from 'react-redux';
import { normalizedProducts, billingModels } from '../../../../common/subscriptionTypes';
import { availableClustersFromQuota } from '../../common/quotaSelectors';

import CreateOSDForm from './CreateOSDForm';

const mapStateToProps = (state, ownProps) => {
  const { quotaList } = state.userProfile.organization;
  const { billingModel, cloudProviderID } = ownProps;
  let { product } = ownProps;
  if (billingModel === billingModels.MARKETPLACE) {
    // TODO: is this necessary?  When user selects marketplace,
    // product will also change to OSD, though maybe not instantaneously.
    product = normalizedProducts.OSD;
  }
  return {
    hasRhInfraQuota: availableClustersFromQuota(quotaList, {
      product, billingModel, cloudProviderID, isBYOC: false,
    }) > 0,
    hasBYOCQuota: availableClustersFromQuota(quotaList, {
      product, billingModel, cloudProviderID, isBYOC: true,
    }) > 0,
  };
};

export default connect(mapStateToProps)(CreateOSDForm);
