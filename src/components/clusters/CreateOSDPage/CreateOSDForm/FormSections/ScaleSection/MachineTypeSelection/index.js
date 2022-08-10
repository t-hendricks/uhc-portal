import { connect } from 'react-redux';
import MachineTypeSelection from './MachineTypeSelection';
import { getMachineTypes } from '../../../../../../../redux/actions/machineTypesActions';
import { getDefaultFlavour } from '../../../../../../../redux/actions/flavourActions';

const mapStateToProps = state => ({
  flavours: state.flavours,
  machineTypes: state.machineTypes,
  organization: state.userProfile.organization,
  quota: state.userProfile.organization.quotaList,
});

const mapDispatchToProps = {
  getMachineTypes,
  getDefaultFlavour,
};

export default connect(mapStateToProps, mapDispatchToProps)(MachineTypeSelection);
