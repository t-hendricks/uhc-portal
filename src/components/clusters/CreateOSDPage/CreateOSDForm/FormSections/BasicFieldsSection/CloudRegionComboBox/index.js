import { connect } from 'react-redux';

import CloudRegionComboBox from './CloudRegionComboBox';
import { cloudProviderActions } from '../../../../../../../redux/actions/cloudProviderActions';

const mapStateToProps = state => ({
  cloudProviders: state.cloudProviders,
});

const mapDispatchToProps = {
  getCloudProviders: cloudProviderActions.getCloudProviders,
};

export default connect(mapStateToProps, mapDispatchToProps)(CloudRegionComboBox);
