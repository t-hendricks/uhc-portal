import { connect } from 'react-redux';
import getPersistentStorage from '../../../../../redux/actions/persistentStorageActions';
import PersistentStorageComboBox from './PersistentStorageComboBox';
import { getOrganizationAndQuota } from '../../../../../redux/actions/userActions';

const mapStateToProps = state => ({
  persistentStorageValues: state.persistentStorageValues.persistentStorageValues,
  organization: state.userProfile.organization,
  quota: state.userProfile.organization.quotaList,
});

const mapDispatchToProps = { getPersistentStorage, getOrganizationAndQuota };

export default connect(mapStateToProps, mapDispatchToProps)(PersistentStorageComboBox);
