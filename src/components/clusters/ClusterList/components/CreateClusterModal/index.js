import { connect } from 'react-redux';
import { reduxForm, reset } from 'redux-form';
import result from 'lodash/result';

import { createCluster, resetCreatedClusterResponse } from '../../../../../redux/actions/clustersActions';
import CreateClusterModal from './CreateClusterModal';
import { closeModal } from '../../../../common/Modal/ModalActions';
import shouldShowModal from '../../../../common/Modal/ModalSelectors';


const reduxFormConfig = {
  form: 'CreateCluster',
};
const reduxFormCreateCluster = reduxForm(reduxFormConfig)(CreateClusterModal);

const mapStateToProps = state => ({
  isOpen: shouldShowModal(state, 'create-cluster'),
  isManaged: result(state.modal.activeModal, 'data.isManaged', true),
  createClusterResponse: state.clusters.createdCluster,
  initialValues: {
    name: '',
    nodes_compute: '4',
    dns_base_domain: '',
    aws_access_key_id: '',
    aws_secret_access_key: '',
    region: 'us-east-1',
    multi_az: false,
  },
});

const mapDispatchToProps = dispatch => ({
  onSubmit: (formData, reduxDispatch, ownProps) => {
    const clusterRequest = {
      name: formData.name,
      region: {
        id: formData.region,
      },
      flavour: {
        id: '4',
      },
      nodes: {
        compute: parseInt(formData.nodes_compute, 10),
      },
      dns: {
        base_domain: formData.dns_base_domain,
      },
      aws: {
        access_key_id: formData.aws_access_key_id,
        secret_access_key: formData.aws_secret_access_key,
      },
      multi_az: formData.multi_az,
      network: {
        machine_cidr: formData.network_machine_cidr,
        service_cidr: formData.network_service_cidr,
        pod_cidr: formData.network_pod_cidr,
      },
      managed: ownProps.isManaged,
    };

    // Add router shards
    if (formData.network_router_shards) {
      clusterRequest.network.router_shards = {
        items: [],
      };
      formData.network_router_shards.forEach((routerShard) => {
        clusterRequest.network.router_shards.items.push({
          label: routerShard.label,
          scheme: 'internet-facing',
        });
      });
    }

    // Fill aws credential only for self-managed clusters.
    if (!ownProps.isManaged) {
      clusterRequest.aws = {
        access_key_id: formData.aws_access_key_id,
        secret_access_key: formData.aws_secret_access_key,
      };
    }

    dispatch(createCluster(clusterRequest));
  },
  resetResponse: () => dispatch(resetCreatedClusterResponse()),
  closeModal: () => dispatch(closeModal()),
  resetForm: () => dispatch(reset('CreateCluster')),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormCreateCluster);
