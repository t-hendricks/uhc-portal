import { connect } from 'react-redux';
import get from 'lodash/get';

import CloudRegionComboBox from './CloudRegionComboBox';

const mapStateToProps = (state, ownProps) => {
  const regions = get(state, `cloudProviders.providers[${ownProps.cloudProviderID}].regions`, {});
  const enabledRegions = (Object.values(regions)).filter(region => region.enabled);
  return ({
    cloudProviders: state.cloudProviders,
    availableRegions: ownProps.isBYOC
      ? enabledRegions : enabledRegions.filter(region => !region.ccs_only),

  });
};

export default connect(mapStateToProps, null)(CloudRegionComboBox);
