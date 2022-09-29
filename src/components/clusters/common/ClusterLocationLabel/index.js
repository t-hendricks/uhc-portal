import { connect } from 'react-redux';
import { cloudProviderActions } from '../../../../redux/actions/cloudProviderActions';
import ClusterLocationLabel from './ClusterLocationLabel';

const mapStateToProps = (state) => ({
  cloudProviders: state.cloudProviders,
});

const mapDispatchToProps = {
  getCloudProviders: cloudProviderActions.getCloudProviders,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClusterLocationLabel);
