import { connect } from 'react-redux';
import { reduxForm, reset } from 'redux-form';
import { createCluster, resetCreatedClusterResponse } from '../../../redux/actions/clustersActions';
import CreateOSDCluster from './CreateOSDCluster';


const reduxFormConfig = {
  form: 'CreateCluster',
};
const reduxFormCreateCluster = reduxForm(reduxFormConfig)(CreateOSDCluster);

const mapStateToProps = state => ({
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
  onSubmit: (formData) => {
    const clusterRequest = {
      name: formData.name,
      region: {
        id: formData.region,
      },
      nodes: {
        compute: parseInt(formData.nodes_compute, 10),
        compute_machine_type: {
          id: formData.machine_type,
        },
      },
      multi_az: formData.multi_az,
      network: {
        machine_cidr: formData.network_machine_cidr,
        service_cidr: formData.network_service_cidr,
        pod_cidr: formData.network_pod_cidr,
      },
      managed: true,
    };

    dispatch(createCluster(clusterRequest));
  },
  resetResponse: () => dispatch(resetCreatedClusterResponse()),
  resetForm: () => dispatch(reset('CreateCluster')),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormCreateCluster);
