import get from 'lodash/get';
import { connect } from 'react-redux';

import getPersistentStorage from '../../../../redux/actions/persistentStorageActions';
import PersistentStorageDropdown from './PersistentStorageDropdown';

const mapStateToProps = state => ({
  persistentStorageValues: state.persistentStorageValues,
  quota: get(state, 'userProfile.organization.quotaList.storageQuota.aws.available', 0),
});

const mapDispatchToProps = { getPersistentStorage };

export default connect(mapStateToProps, mapDispatchToProps)(PersistentStorageDropdown);
