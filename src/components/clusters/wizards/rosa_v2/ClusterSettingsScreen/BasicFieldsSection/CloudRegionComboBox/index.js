import { connect } from 'react-redux';
import get from 'lodash/get';
import { formValueSelector } from 'redux-form';

import CloudRegionComboBox from './CloudRegionComboBox';

const mapStateToProps = (state, ownProps) => {
  const valueSelector = formValueSelector('CreateCluster');
  const { cloudProviders, features } = state;
  const regions = get(state, `cloudProviders.providers[${ownProps.cloudProviderID}].regions`, {});
  const isHypershiftSelected = valueSelector(state, 'hypershift') === 'true';
  const isHypershiftEnabled = features.HYPERSHIFT_WIZARD_FEATURE;

  const availableRegions = Object.values(regions).filter((region) => {
    const {
      enabled: isRegionEnabled,
      ccs_only: isCcsOnly,
      supports_hypershift: supportsHypershift,
    } = region;

    if (isHypershiftEnabled && isHypershiftSelected) {
      return supportsHypershift && isRegionEnabled;
    }

    if (!ownProps.isBYOC) {
      return !isCcsOnly && isRegionEnabled;
    }

    return isRegionEnabled;
  });

  return {
    cloudProviders,
    availableRegions,
  };
};

export default connect(mapStateToProps, null)(CloudRegionComboBox);
