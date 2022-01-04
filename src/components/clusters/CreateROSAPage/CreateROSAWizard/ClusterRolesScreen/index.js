import { connect } from 'react-redux';

import wizardConnector from '../../../CreateOSDPage/CreateOSDWizard/WizardConnector';
import ClusterRolesScreen from './ClusterRolesScreen';

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(wizardConnector(ClusterRolesScreen));
