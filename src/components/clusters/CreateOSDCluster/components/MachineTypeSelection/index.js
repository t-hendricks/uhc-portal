import { connect } from 'react-redux';
import MachineTypeSelection from './MachineTypeSelection';
import { getMachineTypes } from '../../../../../redux/actions/machineTypesActions';

const mapStateToProps = state => ({
  machineTypes: state.machineTypes,
  quota: state.userProfile.quota.quotaList,
});

const mapDispatchToProps = {
  getMachineTypes,
};

export default connect(mapStateToProps, mapDispatchToProps)(MachineTypeSelection);
