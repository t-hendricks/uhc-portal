import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';

import wizardConnector from '../WizardConnector';
import ReviewClusterScreen from './ReviewClusterScreen';
import { canAutoScaleOnCreateSelector } from '../../../ClusterDetails/components/MachinePools/MachinePoolsSelectors';

const mapStateToProps = (state) => {
  const valueSelector = getFormValues('CreateCluster');
  const product = valueSelector(state, 'product');

  return {
    formValues: valueSelector(state),
    canAutoScale: canAutoScaleOnCreateSelector(state, product),
  };
};

export default connect(mapStateToProps)(wizardConnector(ReviewClusterScreen));
