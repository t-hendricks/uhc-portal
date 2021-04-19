import { connect } from 'react-redux';

import CloudProviderSelection from './CloudProviderSelection';
import { getOrganizationAndQuota } from '../../../../redux/actions/userActions';
import { OSD_TRIAL_FEATURE } from '../../../../redux/constants/featureConstants';
import { hasManagedQuotaSelector, hasAwsQuotaSelector, hasGcpQuotaSelector } from '../../common/quotaSelectors';
import { billingModels } from '../../../../common/subscriptionTypes';

const mapStateToProps = (state, ownProps) => {
  const { product } = ownProps;
  const { STANDARD, MARKETPLACE } = billingModels;

  const hasProductQuota = hasManagedQuotaSelector(state, product, STANDARD)
                       || hasManagedQuotaSelector(state, product, MARKETPLACE);
  const hasAwsQuota = hasAwsQuotaSelector(state, product, STANDARD)
                   || hasAwsQuotaSelector(state, product, MARKETPLACE);
  const hasGcpQuota = hasGcpQuotaSelector(state, product, STANDARD)
                   || hasGcpQuotaSelector(state, product, MARKETPLACE);

  return {
    hasProductQuota,
    hasAwsQuota,
    hasGcpQuota,
    osdTrialFeature: state.features[OSD_TRIAL_FEATURE],
    organization: state.userProfile.organization,
  };
};

const mapDispatchToProps = {
  getOrganizationAndQuota,
};

export default connect(mapStateToProps, mapDispatchToProps)(CloudProviderSelection);
