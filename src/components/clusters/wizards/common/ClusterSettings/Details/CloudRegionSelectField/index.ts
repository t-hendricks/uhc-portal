import { connect } from 'react-redux';
import { GlobalState } from '~/redux/store';

import { CloudRegionSelectField } from './CloudRegionSelectField';

type OwnProps = {
  cloudProviderID: string;
  isBYOC?: boolean;
};

const mapStateToProps = (state: GlobalState, ownProps: OwnProps) => {
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

export default connect<ReturnType<typeof mapStateToProps>, {}, OwnProps, GlobalState>(
  mapStateToProps,
)(CloudRegionSelectField);
