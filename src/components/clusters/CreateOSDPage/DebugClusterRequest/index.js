import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';

// The component using getFormValues() will re-render on every field change.
// Confining it here avoids influencing performance & behavior of containing form
// (suppose there was a bug triggered or fixed by excess re-rendering -
// don't want this component to make it a heisenbug!)

import DebugClusterRequest from './DebugClusterRequest';

const mapStateToProps = state => ({
  formValues: getFormValues('CreateCluster')(state),
});

export default connect(mapStateToProps)(DebugClusterRequest);
