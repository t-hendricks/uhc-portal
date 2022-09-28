import { connect } from 'react-redux';
import get from 'lodash/get';

import NodeCountInput from './NodeCountInput';

const mapStateToProps = (state) => ({
  machineTypesByID: state.machineTypes.typesByID,
  quota: get(state, 'userProfile.organization.quotaList', {}),
});

export default connect(mapStateToProps)(NodeCountInput);
