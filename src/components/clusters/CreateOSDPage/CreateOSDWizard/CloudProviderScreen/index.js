import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import wizardConnector from '../WizardConnector';
import CloudProviderScreen from './CloudProviderScreen';

const mapStateToProps = (state) => {
  const valueSelector = formValueSelector('CreateCluster');
  const cloudProviderID = valueSelector(state, 'cloud_provider');
  const isByoc = valueSelector(state, 'byoc') === 'true';

  return {
    cloudProviderID,
    isByoc,
    ccsCredentialsValidityResponse: state.ccsInquiries.ccsCredentialsValidity,
  };
};

export default connect(mapStateToProps)(wizardConnector(CloudProviderScreen));
