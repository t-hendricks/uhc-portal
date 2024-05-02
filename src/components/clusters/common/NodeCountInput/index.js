import get from 'lodash/get';
import { connect } from 'react-redux';

import NodeCountInput from './NodeCountInput';

const mapStateToProps = (state) => ({
  machineTypes: state.machineTypes,
  quota: get(state, 'userProfile.organization.quotaList', {}),
});

export default connect(mapStateToProps)(NodeCountInput);
