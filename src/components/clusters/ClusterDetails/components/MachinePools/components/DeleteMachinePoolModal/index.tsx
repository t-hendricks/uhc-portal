import { connect, RootStateOrAny } from 'react-redux';
import { closeModal } from '~/components/common/Modal/ModalActions';
import DeleteMachinePoolModal from './DeleteMachinePoolModal';

const mapStateToProps = (state: RootStateOrAny) => ({
  performDeleteAction: state.modal.data.performDeleteAction,
  machinePoolId: state.modal.data.machinePool.id,
});

const mapDispatchToProps = (dispatch: any) => ({
  closeModal: () => dispatch(closeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteMachinePoolModal);
