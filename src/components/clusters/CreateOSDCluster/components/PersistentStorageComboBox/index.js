import { connect } from 'react-redux';
import getPersistentStorage from '../../../../../redux/actions/persistentStorageActions';
import PersistentStorageComboBox from './PersistentStorageComboBox';

const mapStateToProps = state => ({
  persistentStorageValues: state.persistentStorageValues.persistentStorageValues,
});

const mapDispatchToProps = { getPersistentStorage };

export default connect(mapStateToProps, mapDispatchToProps)(PersistentStorageComboBox);
