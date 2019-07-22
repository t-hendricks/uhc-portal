import { connect } from 'react-redux';
import MachineTypeSelector from './MachineTypeSelector';
import { getMachineTypes } from '../../../../../../redux/actions/machineTypesActions';


const mapStateToProps = state => ({
  machineTypes: state.machineTypes,
});

const mapDispatchToProps = {
  getMachineTypes,
};

export default connect(mapStateToProps, mapDispatchToProps)(MachineTypeSelector);
