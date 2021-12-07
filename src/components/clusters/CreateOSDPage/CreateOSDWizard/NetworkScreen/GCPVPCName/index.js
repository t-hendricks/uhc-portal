import isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import { getGCPCloudProviderVPCs } from '../../ccsInquiriesActions';

import GCPVPCName from './GCPVPCName';

const mapStateToProps = (state) => {
  const { gcpVPCs } = state.ccsInquiries;
  const valueSelector = formValueSelector('CreateCluster');
  const credentials = ccsCredentialsSelector(state);
  const region = valueSelector(state, 'region');
  const hasDependencies = !!(credentials && region);
  const matchesDependencies = (
    gcpVPCs.cloudProvider === 'gcp'
    && isEqual(gcpVPCs.credentials, credentials)
    && gcpVPCs.region === region
  );
  return ({
    gcpVPCs,
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
