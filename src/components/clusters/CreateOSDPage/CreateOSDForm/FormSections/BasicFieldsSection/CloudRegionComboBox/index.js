import { connect } from 'react-redux';

import CloudRegionComboBox from './CloudRegionComboBox';

const mapStateToProps = state => ({
  cloudProviders: state.cloudProviders,
});


export default connect(mapStateToProps, null)(CloudRegionComboBox);
