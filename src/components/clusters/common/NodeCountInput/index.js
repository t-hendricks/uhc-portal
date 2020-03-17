import { connect } from 'react-redux';
import get from 'lodash/get';

import NodeCountInput from './NodeCountInput';

const mapStateToProps = state => ({
  quota: get(state.userProfile.organization, 'quotaList.nodesQuota.aws', {}),
});


export default connect(mapStateToProps)(NodeCountInput);
