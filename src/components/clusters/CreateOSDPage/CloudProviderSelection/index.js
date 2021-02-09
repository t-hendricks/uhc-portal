import { connect } from 'react-redux';

import CloudProviderSelection from './CloudProviderSelection';
import { getOrganizationAndQuota } from '../../../../redux/actions/userActions';
import { normalizedProducts } from '../../../../common/subscriptionTypes';
import { hasManagedQuotaSelector, hasAwsQuotaSelector, hasGcpQuotaSelector } from '../../common/quotaSelectors';

const mapStateToProps = state => ({
  hasOSDQuota: hasManagedQuotaSelector(state, normalizedProducts.OSD),
  hasAwsQuota: hasAwsQuotaSelector(state, normalizedProducts.OSD),
  hasGcpQuota: hasGcpQuotaSelector(state, normalizedProducts.OSD),
  organization: state.userProfile.organization,
});

const mapDispatchToProps = {
  getOrganizationAndQuota,
};


export default connect(mapStateToProps, mapDispatchToProps)(CloudProviderSelection);
