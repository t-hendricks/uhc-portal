import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import get from 'lodash/get';
import { humanizeValueWithUnitGiB } from '../../../../common/units';
import shouldShowModal from '../../../common/Modal/ModalSelectors';
import { closeModal } from '../../../common/Modal/ModalActions';
import { clearClusterResponse, editCluster } from '../../../../redux/actions/clustersActions';
import EditDisconnectedClusterDialog from './EditDisconnectedCluster';

const reduxFormConfig = {
  form: 'EditDisconnectedCluster',
};
const reduxFormEditDisconnected = reduxForm(reduxFormConfig)(EditDisconnectedClusterDialog);

const mapStateToProps = (state) => {
  const cluster = state.modal.data;
  const vCPUs = get(cluster, 'metrics.cpu.total.value');
  const sockets = get(cluster, 'metrics.sockets.total.value');
  const systemType = (vCPUs && !sockets) ? 'virtual' : 'physical';
  const initialValues = {
    id: cluster.id,
    computeNodes: get(cluster, 'metrics.nodes.compute', 0),
    memoryCapacity: humanizeValueWithUnitGiB(get(cluster, 'metrics.memory.total.value')).value,
  };

  return ({
    editClusterResponse: state.clusters.editedCluster,
    initialFormValues: (systemType === 'virtual') ? {
      ...initialValues,
      vCPUs,
    } : {
      ...initialValues,
      sockets,
    },
    isOpen: shouldShowModal(state, 'edit-disconnected-cluster'),
    systemType,
  });
};

const mapDispatchToProps = dispatch => ({
  onSubmit: (formData) => {
    const clusterRequest = {
      metrics: {
        cpu: formData.vCPUs ? {
          total: {
            value: parseInt(formData.vCPUs, 10),
          },
        } : undefined,
        memory: formData.memoryCapacity ? {
          total: {
            unit: 'GiB',
            value: parseFloat(formData.memoryCapacity),
          },
        } : undefined,
        nodes: formData.computeNodes ? {
          compute: parseInt(formData.computeNodes, 10),
        } : undefined,
        sockets: formData.sockets ? {
          total: {
            value: parseInt(formData.sockets, 10),
          },
        } : undefined,
      },
    };
    dispatch(editCluster(formData.id, clusterRequest));
  },
  resetResponse: () => dispatch(clearClusterResponse()),
  closeModal: () => dispatch(closeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormEditDisconnected);
