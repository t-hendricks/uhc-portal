import { connect } from 'react-redux';
import { getMachineTypes } from '~/redux/actions/machineTypesActions';
import { getDefaultFlavour } from '~/redux/actions/flavourActions';
import MachineTypeSelection from './MachineTypeSelection';

const mapStateToProps = (state) => ({
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
