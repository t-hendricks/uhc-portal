import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import { getGCPCloudProviderVPCs } from '../../ccsInquiriesActions';

import GCPVPCName from './GCPVPCName';

const mapStateToProps = (state) => {
  const { gcpVPCs } = state.ccsInquiries;
  const valueSelector = formValueSelector('CreateCluster');
  const gcpCredentialsJSON = valueSelector(state, 'gcp_service_account');
  const region = valueSelector(state, 'region');
  const hasDependencies = !!(gcpCredentialsJSON && region);
  const matchesDependencies = (
    gcpVPCs.cloudProvider === 'gcp'
    && gcpVPCs.credentials === gcpCredentialsJSON
    && gcpVPCs.region === region
  );
  return ({
    gcpVPCs,
    gcpCredentialsJSON,
    region,
    hasDependencies,
    matchesDependencies,
  });
};

const mapDispatchToProps = {
  getGCPCloudProviderVPCs,
};

export default connect(mapStateToProps, mapDispatchToProps)(GCPVPCName);
