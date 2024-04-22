import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { availableClustersFromQuota } from '../../../../common/quotaSelectors';
import BasicFieldsSection from './BasicFieldsSection';

const mapStateToProps = (state, ownProps) => {
  const valueSelector = formValueSelector('CreateCluster');
  const { quotaList } = state.userProfile.organization;
  const { product, billingModel, cloudProviderID, isBYOC } = ownProps;
  const clusterPrivacy = valueSelector(state, 'cluster_privacy');
  const hasDomainPrefix = valueSelector(state, 'has_domain_prefix');

  return {
    clusterPrivacy,
    hasDomainPrefix,
    hasSingleAzQuota:
      availableClustersFromQuota(quotaList, {
        product,
        billingModel,
        cloudProviderID,
        isBYOC,
        isMultiAz: false,
      }) > 0,
    hasMultiAzQuota:
      availableClustersFromQuota(quotaList, {
        product,
        billingModel,
        cloudProviderID,
        isBYOC,
        isMultiAz: true,
      }) > 0,
  };
};

export default connect(mapStateToProps)(BasicFieldsSection);
