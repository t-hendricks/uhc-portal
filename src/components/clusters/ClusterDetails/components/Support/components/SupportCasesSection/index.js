import { connect } from 'react-redux';
import supportActions from '../../SupportActions';
import SupportCasesCard from './SupportCasesCard';

const mapStateToProps = (state) => {
  const { cluster } = state.clusters.details;
  const {
    supportCases = {
      cases: [],
      pending: false,
      subscriptionID: '',
    },
  } = state.clusterSupport;

  return ({
    subscriptionID: cluster.subscription?.id,
    clusterUUID: cluster.external_id,
    product: cluster.product?.id,
    version: cluster.version?.raw_id,
    supportCases,
  });
};

const mapDispatchToProps = dispatch => ({
  getSupportCases: clusterID => dispatch(supportActions.getSupportCases(clusterID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SupportCasesCard);
