import { connect } from 'react-redux';
import get from 'lodash/get';

import CloudRegionComboBox from './CloudRegionComboBox';

const mapStateToProps = (state, ownProps) => {
  const regions = get(state, `cloudProviders.providers[${ownProps.cloudProviderID}].regions`, {});
  const isGcpBYOC = ownProps.isBYOC && ownProps.cloudProviderID === 'gcp';
  return ({
    cloudProviders: state.cloudProviders,
    enabledRegions: isGcpBYOC
      ? Object.values(regions) : (Object.values(regions)).filter(region => region.enabled),
  });
};

export default connect(mapStateToProps, null)(CloudRegionComboBox);
