import { connect } from 'react-redux';
import MachineTypeSelection from './MachineTypeSelection';
import { getMachineTypes } from '../../../../../../../redux/actions/machineTypesActions';

const mapStateToProps = state => ({
  machineTypes: state.machineTypes,
  organization: state.userProfile.organization,
  quota: state.userProfile.organization.quotaList,
});

const mapDispatchToProps = {
  getMachineTypes,
};

export default connect(mapStateToProps, mapDispatchToProps)(MachineTypeSelection);
