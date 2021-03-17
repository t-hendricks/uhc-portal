import { connect } from 'react-redux';

import getPersistentStorage from '../../../../redux/actions/persistentStorageActions';
import PersistentStorageDropdown from './PersistentStorageDropdown';

const mapStateToProps = state => ({
  cluster: state.modal.data,
  persistentStorageValues: state.persistentStorageValues,
  quotaList: state.userProfile.organization.quotaList,
});

const mapDispatchToProps = { getPersistentStorage };

export default connect(mapStateToProps, mapDispatchToProps)(PersistentStorageDropdown);
