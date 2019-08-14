import { connect } from 'react-redux';
import MachineTypeSelection from './MachineTypeSelection';
import { getMachineTypes } from '../../../../../redux/actions/machineTypesActions';
import { getOrganizationAndQuota } from '../../../../../redux/actions/userActions';

const mapStateToProps = state => ({
  machineTypes: state.machineTypes,
  organization: state.userProfile.organization,
  quota: state.userProfile.organization.quotaList,
});

const mapDispatchToProps = {
  getOrganizationAndQuota,
  getMachineTypes,
};

export default connect(mapStateToProps, mapDispatchToProps)(MachineTypeSelection);
