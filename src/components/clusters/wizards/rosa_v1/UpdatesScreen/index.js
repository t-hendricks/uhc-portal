import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import wizardConnector from '~/components/clusters/wizards/common/WizardConnector';

import createOSDInitialValues from '../../common/createOSDInitialValues';

import UpdatesScreen from './UpdatesScreen';

const mapStateToProps = (state, ownProps) => {
  const valueSelector = formValueSelector('CreateCluster');

  const cloudProviderID = valueSelector(state, 'cloud_provider');
  const isMultiAz = valueSelector(state, 'multi_az') === 'true';
  const isByoc = valueSelector(state, 'byoc') === 'true';
  const isHypershiftSelected = valueSelector(state, 'hypershift') === 'true';
  const isAutomaticUpgrade = valueSelector(state, 'upgrade_policy') === 'automatic';
  const product = valueSelector(state, 'product');
  const machinePoolsSubnets = valueSelector(state, 'machinePoolsSubnets');

  return {
    initialValues: createOSDInitialValues({
      cloudProviderID,
      product,
      isByoc,
      isMultiAz,
      isTrialDefault: ownProps.isTrialDefault,
      isHypershiftSelected,
      machinePoolsSubnets,
    }),
    isAutomaticUpgrade,
    product,
    isHypershiftSelected,
  };
};

export default connect(mapStateToProps)(wizardConnector(UpdatesScreen));
