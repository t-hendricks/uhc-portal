import { connect } from 'react-redux';

import CloudProviderSelection from './CloudProviderSelection';
import { getOrganizationAndQuota } from '../../../../redux/actions/userActions';
import { OSD_TRIAL_FEATURE } from '../../../../redux/constants/featureConstants';
import { hasManagedQuotaSelector, hasAwsQuotaSelector, hasGcpQuotaSelector } from '../../common/quotaSelectors';

const mapStateToProps = (state, ownProps) => {
  const { product } = ownProps;

  return {
    hasOSDQuota: hasManagedQuotaSelector(state, product),
    hasAwsQuota: hasAwsQuotaSelector(state, product),
    hasGcpQuota: hasGcpQuotaSelector(state, product),
    osdTrialFeature: state.features[OSD_TRIAL_FEATURE],
    organization: state.userProfile.organization,
  };
};

const mapDispatchToProps = {
  getOrganizationAndQuota,
};


export default connect(mapStateToProps, mapDispatchToProps)(CloudProviderSelection);
