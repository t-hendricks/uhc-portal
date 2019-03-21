import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import {
  editCluster,
  clearClusterResponse,
  fetchClusterRouterShards,
  createClusterRouterShard,
  editClusterRouterShard,
  deleteClusterRouterShard,
} from '../../../../redux/actions/clustersActions';
import EditClusterDialog from './EditClusterDialog';
import { closeModal } from '../../../common/Modal/ModalActions';
import shouldShowModal from '../../../common/Modal/ModalSelectors';

const reduxFormConfig = {
  form: 'EditCluster',
};
const reduxFormEditCluster = reduxForm(reduxFormConfig)(EditClusterDialog);

const mapStateToProps = (state) => {
  const modalData = state.modal.activeModal.data;
  const hasRouterShards = !!(state.clusters.routerShards
                             && state.clusters.routerShards.fulfilled
                             && modalData.managed
                             && modalData.id === state.clusters.routerShards.routerShards.id);
  return ({
    isOpen: shouldShowModal(state, 'edit-cluster'),
    hasRouterShards,
    editClusterResponse: state.clusters.editedCluster,
    initialFormValues: {
      id: modalData.id,
      nodesCompute: modalData.nodes ? modalData.nodes.compute : null,
      routerShards: hasRouterShards ? state.clusters.routerShards.routerShards.items : [],
    },
  });
};

const mapDispatchToProps = dispatch => ({
  onSubmit: (formData, _dispatch, props) => {
    // Update cluster nodes
    const clusterRequest = {
      nodes: {
        compute: parseInt(formData.nodes_compute, 10),
      },
    };
    dispatch(editCluster(formData.id, clusterRequest));

    // Update router shards
    formData.network_router_shards.forEach((routerShard, i) => {
      if (routerShard.id) {
        if (routerShard.label && routerShard.scheme) {
          // Only edit cluster if data was changed
          if (routerShard.label !== props.initialFormValues.routerShards[i].label
              || routerShard.scheme !== props.initialFormValues.routerShards[i].scheme) {
            dispatch(editClusterRouterShard(formData.id, routerShard.id, {
              label: routerShard.label,
              scheme: routerShard.scheme,
            }));
          }
        } else {
          dispatch(deleteClusterRouterShard(formData.id, routerShard.id));
        }
      } else {
        dispatch(createClusterRouterShard(formData.id, routerShard));
      }
    });
  },
  resetResponse: () => dispatch(clearClusterResponse()),
  fetchRouterShards: clusterID => dispatch(fetchClusterRouterShards(clusterID)),
  closeModal: () => dispatch(closeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormEditCluster);
