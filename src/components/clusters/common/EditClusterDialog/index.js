import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import {
  clearClusterResponse,
  createClusterRouterShard,
  deleteClusterRouterShard,
  editCluster,
  editClusterRouterShard,
  fetchClusterRouterShards,
} from '../../../../redux/actions/clustersActions';
import EditClusterDialog from './EditClusterDialog';
import { closeModal } from '../../../common/Modal/ModalActions';
import shouldShowModal from '../../../common/Modal/ModalSelectors';
import minValueSelector from './EditClusterSelectors';

const reduxFormConfig = {
  form: 'EditCluster',
};
const reduxFormEditCluster = reduxForm(reduxFormConfig)(EditClusterDialog);

const mapStateToProps = (state) => {
  const modalData = state.modal.activeModal.data;
  const hasRouterShards = !!(state.clusters.routerShards
                             && state.clusters.routerShards.fulfilled
                             && modalData.id === state.clusters.routerShards.routerShards.id);
  return ({
    isOpen: shouldShowModal(state, 'edit-cluster'),
    hasRouterShards,
    editClusterResponse: state.clusters.editedCluster,
    editRouterShardResponse: state.clusters.editedRouterShards,
    min: minValueSelector(modalData.multi_az),
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
        // Only update router shard if label was changed
        if (routerShard.label) {
          if (routerShard.label !== props.initialFormValues.routerShards[i].label) {
            dispatch(editClusterRouterShard(formData.id, routerShard.id, {
              label: routerShard.label,
              scheme: 'internet-facing',
            }));
          }
        } else {
          // If there was a router shard, but the label was removed, delete it
          dispatch(deleteClusterRouterShard(formData.id, routerShard.id));
        }
      } else {
        dispatch(createClusterRouterShard(formData.id, {
          label: routerShard.label,
          scheme: 'internet-facing',
        }));
      }
    });
  },
  resetResponse: () => dispatch(clearClusterResponse()),
  fetchRouterShards: clusterID => dispatch(fetchClusterRouterShards(clusterID)),
  closeModal: () => dispatch(closeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormEditCluster);
