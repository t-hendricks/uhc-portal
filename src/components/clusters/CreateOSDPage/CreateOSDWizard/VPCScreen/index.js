import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import wizardConnector from '../WizardConnector';
import VPCScreen from './VPCScreen';

const mapStateToProps = (state) => {
  const valueSelector = formValueSelector('CreateCluster');

  return {
    cloudProviderID: valueSelector(state, 'cloud_provider'),
    isMultiAz: valueSelector(state, 'multi_az') === 'true',
    selectedRegion: valueSelector(state, 'region'),
  };
};

export default connect(mapStateToProps)(wizardConnector(VPCScreen));
