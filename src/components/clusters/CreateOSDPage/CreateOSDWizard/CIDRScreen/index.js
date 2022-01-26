import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import wizardConnector from '../WizardConnector';
import CIDRScreen from './CIDRScreen';

const mapStateToProps = (state) => {
  const valueSelector = formValueSelector('CreateCluster');

  return {
    cloudProviderID: valueSelector(state, 'cloud_provider'),
    isMultiAz: valueSelector(state, 'multi_az') === 'true',
  };
};

export default connect(mapStateToProps)(wizardConnector(CIDRScreen));
