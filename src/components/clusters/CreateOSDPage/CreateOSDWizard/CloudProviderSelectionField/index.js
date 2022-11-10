import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import { availableQuota, quotaTypes } from '../../../common/quotaSelectors';

import CloudProviderSelectionField from './CloudProviderSelectionField';

const mapStateToProps = (state) => {
  const valueSelector = formValueSelector('CreateCluster');

  const product = valueSelector(state, 'product');
  const billingModel = valueSelector(state, 'billing_model');
  const isBYOC = valueSelector(state, 'byoc') === 'true';

  const quotaQuery = (params) =>
    availableQuota(state.userProfile.organization.quotaList, params) > 0;

  return {
    product,
    hasGcpQuota: quotaQuery({
      resourceType: quotaTypes.CLUSTER,
      cloudProviderID: 'gcp',
      product,
      billingModel,
      isBYOC,
    }),

    hasAwsQuota: quotaQuery({
      resourceType: quotaTypes.CLUSTER,
      cloudProviderID: 'aws',
      product,
      billingModel,
      isBYOC,
    }),
  };
};

export default connect(mapStateToProps)(CloudProviderSelectionField);
