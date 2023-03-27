import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { GlobalState } from '~/redux/store';
import wizardConnector from '../../../CreateOSDPage/CreateOSDWizard/WizardConnector';

import ControlPlaneScreen from './ControlPlaneScreen';

const mapStateToProps = (state: GlobalState) => {
  const formValues = getFormValues('CreateCluster')(state);

  return {
    formValues,
  };
};

export default connect(mapStateToProps)(wizardConnector(ControlPlaneScreen));
