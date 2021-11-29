import { connect } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import InsightsTable from './InsightsTable';

const mapDispatchToProps = dispatch => ({
  addNotification: data => dispatch(addNotification(data)),
});

export default connect(null, mapDispatchToProps)(InsightsTable);
