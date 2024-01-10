import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import createOSDInitialValues from '../../createOSDInitialValues';

import wizardConnector from '../WizardConnector';

import BillingModelSection from '../../CreateOSDForm/FormSections/BillingModelSection';

const mapStateToProps = (state, ownProps) => {
  const valueSelector = formValueSelector('CreateCluster');

  const cloudProviderID = valueSelector(state, 'cloud_provider');
  const isMultiAz = valueSelector(state, 'multi_az') === 'true';
  const isByoc = valueSelector(state, 'byoc') === 'true';
  const billingModel = valueSelector(state, 'billing_model');
  const machinePoolsSubnets = valueSelector(state, 'machine_pools_subnets');

  return {
    initialValues: createOSDInitialValues({
      cloudProviderID,
      isMultiAz,
      isByoc,
      isTrialDefault: ownProps.isTrialDefault,
      machinePoolsSubnets,
    }),
    byocSelected: isByoc,
    billingModel,
    isMultiAz,
  };
};

export default connect(mapStateToProps)(wizardConnector(BillingModelSection));
