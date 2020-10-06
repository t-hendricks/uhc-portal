import { connect } from 'react-redux';
import { OSD_UPGRADES_FEATURE } from '../../../../redux/constants/featureConstants';
import ClusterUpdateLink from './ClusterUpdateLink';


const mapStateToProps = state => ({
  osdUpgradesEnabled: state.features[OSD_UPGRADES_FEATURE],
});


export default connect(mapStateToProps)(ClusterUpdateLink);
