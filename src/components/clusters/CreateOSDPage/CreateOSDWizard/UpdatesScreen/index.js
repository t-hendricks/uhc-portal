import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import wizardConnector from '../WizardConnector';
import UpdatesScreen from './UpdatesScreen';

const mapStateToProps = (state) => {
  const valueSelector = formValueSelector('CreateCluster');

  const isAutomaticUpgrade = valueSelector(state, 'upgrade_policy') === 'automatic';
  const product = valueSelector(state, 'product');

  return {
    isAutomaticUpgrade,
    product,
  };
};

export default connect(mapStateToProps)(wizardConnector(UpdatesScreen));
