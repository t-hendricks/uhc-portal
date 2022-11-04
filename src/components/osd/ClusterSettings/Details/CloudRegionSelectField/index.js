import { connect } from 'react-redux';

import { CloudRegionSelectField } from './CloudRegionSelectField';

const mapStateToProps = (state, ownProps) => {
  const { cloudProviders } = state;
  const regions = cloudProviders.providers?.[ownProps.cloudProviderID]?.regions || {};
  const enabledRegions = Object.values(regions)?.filter((region) => region.enabled);

  return {
    cloudProviders,
    availableRegions: ownProps.isBYOC
      ? enabledRegions
      : enabledRegions.filter((region) => !region.ccs_only),
  };
};

export default connect(mapStateToProps, null)(CloudRegionSelectField);
