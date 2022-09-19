import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';

import { openModal } from '~/components/common/Modal/ModalActions';
import VPCDetailsCard from './VPCDetailsCard';
import { noProxyDomainsArray } from '../../NetworkingSelector';

const mapStateToProps = (state) => {
  const { cluster } = state.clusters.details;
  return {
    privateLink: cluster.aws?.private_link,
    formValues: getFormValues('EditClusterWideProxy')(state),
    httpProxyUrl: cluster.proxy?.http_proxy,
    httpsProxyUrl: cluster.proxy?.https_proxy,
    // noProxyDomains: noProxyDomainsArray(cluster.proxy?.no_proxy) || null,
    additionalTrustBundle: cluster.additional_trust_bundle,
    gcpVPCName: cluster.gcp_network?.vpc_name,
  };
};

const mapDispatchToProps = (dispatch) => ({
  openModal: (name, data) => dispatch(openModal(name, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VPCDetailsCard);
