import { connect } from 'react-redux';
import { availableClustersFromQuota } from '../../../../common/quotaSelectors';
import BasicFieldsSection from './BasicFieldsSection';

const mapStateToProps = (state, ownProps) => {
  const { quotaList } = state.userProfile.organization;
  const {
    product, billingModel, cloudProviderID, isBYOC,
  } = ownProps;

  return {
    hasSingleAzQuota: availableClustersFromQuota(quotaList, {
      product, billingModel, cloudProviderID, isBYOC, isMultiAz: false,
    }) > 0,
    hasMultiAzQuota: availableClustersFromQuota(quotaList, {
      product, billingModel, cloudProviderID, isBYOC, isMultiAz: true,
    }) > 0,
  };
};

export default connect(mapStateToProps)(BasicFieldsSection);
