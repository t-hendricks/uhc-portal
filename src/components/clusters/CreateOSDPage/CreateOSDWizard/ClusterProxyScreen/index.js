import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

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

export default connect(mapStateToProps)(wizardConnector(ClusterProxyScreen));
