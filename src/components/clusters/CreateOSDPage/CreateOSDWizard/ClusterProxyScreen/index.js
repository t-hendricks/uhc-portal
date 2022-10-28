import { connect } from 'react-redux';
import { formValueSelector, change, getFormValues } from 'redux-form';

import wizardConnector from '../WizardConnector';
import ClusterProxyScreen from './ClusterProxyScreen';

const mapStateToProps = (state) => {
  const valueSelector = formValueSelector('CreateCluster');
  const formValues = getFormValues('CreateCluster')(state);

  return {
    product: valueSelector(state, 'product'),
    httpProxyUrl: valueSelector(state, 'http_proxy_url'),
    httpsProxyUrl: valueSelector(state, 'https_proxy_url'),
    noProxyDomains: valueSelector(state, 'no_proxy'),
    additionalTrustBundle: valueSelector(state, 'additional_trust_bundle'),
    formValues,
  };
};

const mapDispatchToProps = (dispatch) => ({
  sendError: () => {
    // 'invalid file' is a magic string that triggers a validation error
    // in src/common/validators.js validateCA function
    dispatch(change('CreateCluster', 'additional_trust_bundle', 'invalid file'));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(wizardConnector(ClusterProxyScreen));
