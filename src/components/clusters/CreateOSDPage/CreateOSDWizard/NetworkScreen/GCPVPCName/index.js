import isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import { getGCPCloudProviderVPCs } from '../../ccsInquiriesActions';
import ccsCredentialsSelector from '../../credentialsSelector';

import GCPVPCName from './GCPVPCName';

const mapStateToProps = (state) => {
  const { vpcs } = state.ccsInquiries;
  const valueSelector = formValueSelector('CreateCluster');
  const credentials = ccsCredentialsSelector('gcp', state);
  const region = valueSelector(state, 'region');
  const hasDependencies = !!(credentials && region);
  const matchesDependencies = (
    vpcs.cloudProvider === 'gcp'
    && isEqual(vpcs.credentials, credentials)
    && vpcs.region === region
  );
  return ({
    vpcs,
    credentials,
    region,
    hasDependencies,
    matchesDependencies,
  });
};

const mapDispatchToProps = {
  getGCPCloudProviderVPCs,
};

export default connect(mapStateToProps, mapDispatchToProps)(GCPVPCName);
