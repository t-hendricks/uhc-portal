import { connect } from 'react-redux';

import CloudProviderSelection from './CloudProviderSelection';
import { getOrganizationAndQuota } from '../../../../redux/actions/userActions';
import { hasOSDQuotaSelector, hasAwsQuotaSelector, hasGcpQuotaSelector } from '../../CreateClusterPage/quotaSelector';

const mapStateToProps = state => ({
  hasOSDQuota: hasOSDQuotaSelector(state),
  hasAwsQuota: hasAwsQuotaSelector(state),
  hasGcpQuota: hasGcpQuotaSelector(state),
  organization: state.userProfile.organization,
});

const mapDispatchToProps = {
  getOrganizationAndQuota,
};


export default connect(mapStateToProps, mapDispatchToProps)(CloudProviderSelection);
