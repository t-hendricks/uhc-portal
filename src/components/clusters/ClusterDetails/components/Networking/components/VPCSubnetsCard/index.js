import { connect } from 'react-redux';
import VPCSubnetsCard from './VPCSubnetsCard';

const mapStateToProps = (state) => {
  const { cluster } = state.clusters.details;
  return {
    awsSubnets: cluster.aws?.subnet_ids,
    gcpNetwork: cluster.gcp_network,
  };
};

export default connect(mapStateToProps)(VPCSubnetsCard);
