import { connect } from 'react-redux';
import { formValueSelector, change } from 'redux-form';

import wizardConnector from '../WizardConnector';
import ClusterProxyScreen from './ClusterProxyScreen';

const mapStateToProps = (state) => {
  const valueSelector = formValueSelector('CreateCluster');

  return {
    product: valueSelector(state, 'product'),
    httpProxyUrl: valueSelector(state, 'http_proxy_url'),
    httpsProxyUrl: valueSelector(state, 'https_proxy_url'),
    additionalTrustBundle: valueSelector(state, 'additional_trust_bundle'),
  };
};

const mapDispatchToProps = dispatch => ({
  sendError: () => {
    // 'invalid file' is a magic string that triggers a validation error
    // in src/common/validators.js validateCA function
    dispatch(change('CreateCluster', 'additional_trust_bundle', 'invalid file'));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(wizardConnector(ClusterProxyScreen));
