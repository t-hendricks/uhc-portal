import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import { getGCPKeys } from '../../../../CreateOSDWizard/ccsInquiriesActions';

import DynamicSelect from '../../../../../../common/DynamicSelect';

const mapStateToProps = (state) => {
  const { gcpKeys } = state.ccsInquiries;
  const valueSelector = formValueSelector('CreateCluster');
  const gcpCredentialsJSON = valueSelector(state, 'gcp_service_account');
  const keyLocation = valueSelector(state, 'key_location');
  const keyRing = valueSelector(state, 'key_ring');
  const hasDependencies = !!(gcpCredentialsJSON && keyLocation && keyRing);
  const matchesDependencies = (
    gcpKeys.cloudProvider === 'gcp'
    && gcpKeys.credentials === gcpCredentialsJSON
    && gcpKeys.keyLocation === keyLocation
    && gcpKeys.keyRing === keyRing
  );
  return ({
    hasDependencies,
    matchesDependencies,
    requestStatus: gcpKeys,
    items: (gcpKeys.data?.items || []).map(key => key.name),
  });
};

const mapDispatchToProps = {
  // To give the wrapped component a clean parameter-less action,
  // we need access to state (via redux-thunk) to peek at fields we depend on.
  loadData: () => (dispatch, getState) => {
    const state = getState();
    const valueSelector = formValueSelector('CreateCluster');
    const gcpCredentialsJSON = valueSelector(state, 'gcp_service_account');
    const keyLocation = valueSelector(state, 'key_location');
    const keyRing = valueSelector(state, 'key_ring');

    dispatch(getGCPKeys(gcpCredentialsJSON, keyLocation, keyRing));
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(DynamicSelect);
