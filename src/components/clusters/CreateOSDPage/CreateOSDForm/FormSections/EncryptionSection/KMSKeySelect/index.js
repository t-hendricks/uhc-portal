import isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import { getGCPKeys } from '../../../../CreateOSDWizard/ccsInquiriesActions';
import ccsCredentialsSelector from '../../../../CreateOSDWizard/credentialsSelector';

import DynamicSelect from '../../../../../../common/DynamicSelect';

const mapStateToProps = (state) => {
  const { gcpKeys } = state.ccsInquiries;
  const valueSelector = formValueSelector('CreateCluster');
  const credentials = ccsCredentialsSelector('gcp', state);
  const keyLocation = valueSelector(state, 'key_location');
  const keyRing = valueSelector(state, 'key_ring');
  const hasDependencies = !!(credentials && keyLocation && keyRing);
  const matchesDependencies = (
    gcpKeys.cloudProvider === 'gcp'
    && isEqual(gcpKeys.credentials, credentials)
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
    const credentials = ccsCredentialsSelector('gcp', state);
    const keyLocation = valueSelector(state, 'key_location');
    const keyRing = valueSelector(state, 'key_ring');

    dispatch(getGCPKeys(credentials, keyLocation, keyRing));
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(DynamicSelect);
