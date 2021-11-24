import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import { getGCPCloudProviderVPCs } from '../../ccsInquiriesActions';

import GCPVPCSubnet from './GCPVPCSubnet';

const mapStateToProps = (state) => {
  const { gcpVPCs } = state.ccsInquiries;
  const valueSelector = formValueSelector('CreateCluster');
  const gcpCredentialsJSON = valueSelector(state, 'gcp_service_account');
  const region = valueSelector(state, 'region');
  const vpcName = valueSelector(state, 'vpc_name');
  const hasDependencies = !!(gcpCredentialsJSON && region && vpcName);
  const matchesDependencies = (
    gcpVPCs.cloudProvider === 'gcp'
    && gcpVPCs.credentials === gcpCredentialsJSON
    && gcpVPCs.region === region
  );
  return ({
    gcpVPCs,
    gcpCredentialsJSON,
    region,
    vpcName,
    hasDependencies,
    matchesDependencies,
  });
};

const mapDispatchToProps = {
  getGCPCloudProviderVPCs,
};

export default connect(mapStateToProps, mapDispatchToProps)(GCPVPCSubnet);
