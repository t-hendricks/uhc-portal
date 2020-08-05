import { connect } from 'react-redux';
import get from 'lodash/get';

import NodeCountInput from './NodeCountInput';

const mapStateToProps = (state, ownProps) => ({
  machineTypesByID: state.machineTypes.typesByID,
  quota: get(state, `userProfile.organization.quotaList.nodesQuota.${ownProps.cloudProviderID}`, {}),
});

export default connect(mapStateToProps)(NodeCountInput);
