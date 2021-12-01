import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import { getGCPKeyRings } from '../../../../CreateOSDWizard/ccsInquiriesActions';

import DynamicSelect from '../../../../../../common/DynamicSelect';

const mapStateToProps = (state) => {
  const { gcpKeyRings } = state.ccsInquiries;
  const valueSelector = formValueSelector('CreateCluster');
  const gcpCredentialsJSON = valueSelector(state, 'gcp_service_account');
  const keyLocation = valueSelector(state, 'key_location');
  const hasDependencies = !!(gcpCredentialsJSON && keyLocation);
  const matchesDependencies = (
    gcpKeyRings.cloudProvider === 'gcp'
    && gcpKeyRings.credentials === gcpCredentialsJSON
    && gcpKeyRings.keyLocation === keyLocation
  );
  return ({
    hasDependencies,
    matchesDependencies,
    requestStatus: gcpKeyRings,
    items: (gcpKeyRings.data?.items || []).map(ring => ring.name),
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

    dispatch(getGCPKeyRings(gcpCredentialsJSON, keyLocation));
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(DynamicSelect);
