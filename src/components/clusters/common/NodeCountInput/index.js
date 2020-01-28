import { connect } from 'react-redux';
import get from 'lodash/get';

import NodeCountInput from './NodeCountInput';

const mapStateToProps = state => ({
  quota: get(state.userProfile.organization, 'quotaList.nodeQuota', {}),
});


export default connect(mapStateToProps)(NodeCountInput);
