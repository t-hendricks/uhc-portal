import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import wizardConnector from '../WizardConnector';
import CloudProviderScreen from './CloudProviderScreen';

const mapStateToProps = (state) => {
  const valueSelector = formValueSelector('CreateCluster');
  const cloudProviderId = valueSelector(state, 'cloud_provider');
  const isByoc = valueSelector(state, 'byoc') === 'true';
  const accountId = valueSelector(state, 'account_id');
  const accessKeyId = valueSelector(state, 'access_key_id');
  const secretAccessKey = valueSelector(state, 'secret_access_key');
  const gcpServiceAccount = valueSelector(state, 'gcp_service_account');

  return {
    formValues: {
      cloudProviderId,
      isByoc,
      accountId,
      accessKeyId,
      secretAccessKey,
      gcpServiceAccount,
    },
    ccsCredentialsValidityResponse: state.ccsInquiries.ccsCredentialsValidity,
  };
};

export default connect(mapStateToProps)(wizardConnector(CloudProviderScreen));
