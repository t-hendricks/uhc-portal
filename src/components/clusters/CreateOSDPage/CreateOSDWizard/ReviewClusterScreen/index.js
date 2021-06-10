import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';

import wizardConnector from '../WizardConnector';
import ReviewClusterScreen from './ReviewClusterScreen';

const mapStateToProps = (state) => {
  const valueSelector = getFormValues('CreateCluster');

  return {
    formValues: valueSelector(state),
  };
};

export default connect(mapStateToProps)(wizardConnector(ReviewClusterScreen));
