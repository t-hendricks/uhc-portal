import { connect } from 'react-redux';
import get from 'lodash/get';

import KMSKeyLocationComboBox from './KMSKeyLocationComboBox';

const mapStateToProps = (state, ownProps) => {
  let kmsRegions;
  let kmsRegionsArray = [];

  const regions = get(state, 'cloudProviders.providers.gcp.regions', {});

  if (ownProps.selectedRegion && regions[ownProps.selectedRegion]) {
    kmsRegions = regions[ownProps.selectedRegion].kms_location_id;
  }

  if (kmsRegions) {
    kmsRegionsArray = kmsRegions.split(',');
  }
  kmsRegionsArray.push(ownProps.selectedRegion);
  return {
    kmsRegionsArray,
  };
};

export default connect(mapStateToProps, null)(KMSKeyLocationComboBox);
