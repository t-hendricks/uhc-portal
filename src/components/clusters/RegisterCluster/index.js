import { connect } from 'react-redux';
import { reduxForm, reset } from 'redux-form';
import RegisterCluster from './RegisterCluster';
import { openModal, closeModal } from '../../common/Modal/ModalActions';
import shouldShowModal from '../../common/Modal/ModalSelectors';
import { registerDisconnectedCluster, resetCreatedClusterResponse } from '../../../redux/actions/clustersActions';


const reduxFormConfig = {
  form: 'RegisterCluster',
};

const reduxFormRegisterCluster = reduxForm(reduxFormConfig)(RegisterCluster);


const mapStateToProps = state => ({
  registerClusterResponse: state.clusters.createdCluster,
  isOpen: shouldShowModal(state, 'register-cluster-error'),
  initialValues: {
    cluster_id: '',
    display_name: '',
    web_console_url: '',
    vcpu_num: '',
    socket_num: '',
    operating_system: '',
    memory_gib: '',
    nodes_compute: '',
  },
});

const mapDispatchToProps = dispatch => ({
  closeModal: (name) => { dispatch(closeModal(name)); },
  openModal: (name) => { dispatch(openModal(name)); },
  onSubmit: (formData) => {
    let cpuMetric = {};
    if (formData.system_type === 'physical') {
      cpuMetric = {
        sockets: {
          total: {
            value: parseInt(formData.socket_num, 10),
          },
        },
      };
    }

    if (formData.system_type === 'virtual') {
      cpuMetric = {
        cpu: {
          total: {
            value: parseInt(formData.cpu, 10),
          },
        },
      };
    }

    const clusterRequest = {
      external_id: formData.cluster_id,
      display_name: formData.display_name,
      nodes: {
        compute: parseInt(formData.nodes_compute, 10),
      },
      metrics: {
        operating_system: formData.operating_system,
        ...cpuMetric,
        memory: {
          total: {
            value: parseFloat(formData.memory_gib),
            unit: 'GiB',
          },
        },
      },
      console: {
        url: formData.web_console_url,
      },
    };

    dispatch(registerDisconnectedCluster(clusterRequest));
  },
  resetResponse: () => dispatch(resetCreatedClusterResponse()),
  resetForm: () => dispatch(reset('RegisterCluster')),
});


export default connect(mapStateToProps, mapDispatchToProps)(reduxFormRegisterCluster);
