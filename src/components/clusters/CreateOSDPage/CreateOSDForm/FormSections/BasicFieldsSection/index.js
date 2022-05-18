import { connect } from 'react-redux';
import { availableClustersFromQuota } from '../../../../common/quotaSelectors';
import { normalizedProducts } from '../../../../../../common/subscriptionTypes';
import BasicFieldsSection from './BasicFieldsSection';

const mapStateToProps = (state, ownProps) => {
  const { quotaList } = state.userProfile.organization;
  const {
    product, billingModel, cloudProviderID, isBYOC,
  } = ownProps;

  // TODO: Hack!!! until we implement quotas for ROSA
  const nonRosaProduct = product === normalizedProducts.ROSA ? normalizedProducts.OSD : product;

  return {
    hasSingleAzQuota: availableClustersFromQuota(quotaList, {
      nonRosaProduct, billingModel, cloudProviderID, isBYOC, isMultiAz: false,
    }) > 0,
    hasMultiAzQuota: availableClustersFromQuota(quotaList, {
      nonRosaProduct, billingModel, cloudProviderID, isBYOC, isMultiAz: true,
    }) > 0,
  };
};

export default connect(mapStateToProps)(BasicFieldsSection);
