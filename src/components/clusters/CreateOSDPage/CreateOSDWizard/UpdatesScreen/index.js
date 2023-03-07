import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import wizardConnector from '../WizardConnector';
import UpdatesScreen from './UpdatesScreen';

import createOSDInitialValues from '../../createOSDInitialValues';

const mapStateToProps = (state, ownProps) => {
  const valueSelector = formValueSelector('CreateCluster');

  const cloudProviderID = valueSelector(state, 'cloud_provider');
  const isMultiAz = valueSelector(state, 'multi_az') === 'true';
  const isByoc = valueSelector(state, 'byoc') === 'true';

  const hypershiftSelected = valueSelector(state, 'hypershift') === 'true';

  const isAutomaticUpgrade = valueSelector(state, 'upgrade_policy') === 'automatic';
  const product = valueSelector(state, 'product');

  return {
    initialValues: createOSDInitialValues({
      cloudProviderID,
      isByoc,
      isMultiAz,
      isTrialDefault: ownProps.isTrialDefault,
      hypershiftSelected,
    }),
    isAutomaticUpgrade,
    product,
    hypershiftSelected,
  };
};

export default connect(mapStateToProps)(wizardConnector(UpdatesScreen));
