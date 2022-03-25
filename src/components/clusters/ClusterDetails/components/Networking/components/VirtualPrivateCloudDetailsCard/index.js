import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import VirtualPrivateCloudDetailsCard from './VirtualPrivateCloudDetailsCard';
import { openModal } from '../../../../../../common/Modal/ModalActions';

const mapStateToProps = (state) => {
  const { cluster } = state.clusters.details;
  return {
    privateLink: cluster.aws.private_link,
    formValues: getFormValues('EditClusterWideProxy')(state),
    httpProxyUrl: cluster.proxy?.http_proxy,
    httpsProxyUrl: cluster.proxy?.https_proxy,
    additionalTrustBundle: cluster.additional_trust_bundle,
    gcpVPCName: cluster.gcp_network?.vpc_name,
  };
};

const mapDispatchToProps = dispatch => ({
  openModal: (name, data) => dispatch(openModal(name, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VirtualPrivateCloudDetailsCard);
