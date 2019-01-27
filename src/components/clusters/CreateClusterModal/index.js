import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import result from 'lodash/result';

import { createCluster, resetCreatedClusterResponse } from '../../../redux/actions/clustersActions';
import CreateClusterModal from './CreateClusterModal';
import { closeModal } from '../../Modal/ModalActions';
import shouldShowModal from '../../Modal/ModalSelectors';


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

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: (formData) => {
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
    dispatch(createCluster(clusterRequest));
  },
  resetResponse: () => dispatch(resetCreatedClusterResponse()),
  closeModal: () => dispatch(closeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormCreateCluster);
