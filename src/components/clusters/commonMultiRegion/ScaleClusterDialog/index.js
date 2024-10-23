import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import ScaleClusterDialog from './ScaleClusterDialog';

const reduxFormConfig = {
  form: 'ScaleCluster',
  enableReinitialize: true,
};

const reduxFormEditCluster = reduxForm(reduxFormConfig)(ScaleClusterDialog);

const mapStateToProps = (state) => {
  const modalData = state.modal.data;
  return {
    // Initial values needs to be here for now in order for Redux Forms to work properly
    initialValues: {
      id: modalData.id,
      nodes_compute: modalData.nodes ? modalData.nodes.compute : null,
      load_balancers: modalData.load_balancer_quota ? modalData.load_balancer_quota : 0,
      persistent_storage: modalData.storage_quota ? modalData.storage_quota.value : 107374182400,
    },
  };
};

export default connect(mapStateToProps)(reduxFormEditCluster);
