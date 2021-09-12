import { connect } from 'react-redux';
import { formValueSelector, getFormValues } from 'redux-form';

import wizardConnector from '../WizardConnector';
import ReviewClusterScreen from './ReviewClusterScreen';
import { canAutoScaleOnCreateSelector } from '../../../ClusterDetails/components/MachinePools/MachinePoolsSelectors';

const mapStateToProps = (state) => {
  const valueSelector = formValueSelector('CreateCluster');
  const product = valueSelector(state, 'product');
  const canAutoScale = canAutoScaleOnCreateSelector(state, product);
  return {
    formValues: getFormValues('CreateCluster')(state),
    canAutoScale,
  };
};

export default connect(mapStateToProps)(wizardConnector(ReviewClusterScreen));
