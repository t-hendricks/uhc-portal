import isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import { getGCPCloudProviderVPCs } from '../../ccsInquiriesActions';
import ccsCredentialsSelector from '../../credentialsSelector';

import GCPVPCSubnet from './GCPVPCSubnet';

const mapStateToProps = (state) => {
  const { vpcs } = state.ccsInquiries;
  const valueSelector = formValueSelector('CreateCluster');
  const credentials = ccsCredentialsSelector(state);
  const region = valueSelector(state, 'region');
  const vpcName = valueSelector(state, 'vpc_name');
  const hasDependencies = !!(credentials && region && vpcName);
  const matchesDependencies = (
    vpcs.cloudProvider === 'gcp'
    && isEqual(vpcs.credentials, credentials)
    && vpcs.region === region
    // TODO: && === vpcName missing here?
  );
  return ({
    vpcs,
    credentials,
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
