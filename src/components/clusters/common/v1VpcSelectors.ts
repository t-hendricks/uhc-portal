import { createSelector } from 'reselect';
import { formValueSelector } from 'redux-form';

import { GlobalState } from '~/redux/store';
import { VPCResponse } from '~/redux/reducers/ccsInquiriesReducer';
import { PromiseReducerState } from '~/redux/types';

// These selectors can only be used for V1, as they use the redux-form state
const valueSelector = formValueSelector('CreateCluster');

const vpcsSelector = (state: GlobalState): PromiseReducerState<VPCResponse> =>
  state.ccsInquiries.vpcs;

const cloudProviderIDSelector = (state: GlobalState) => valueSelector(state, 'cloud_provider');

const regionSelector = (state: GlobalState) => valueSelector(state, 'region');

const awsCredentials = (state: GlobalState) => ({
  account_id: valueSelector(state, 'associated_aws_id'),
  sts: {
    role_arn: valueSelector(state, 'installer_role_arn'),
  },
});

const vpcInquiryRequestSelector = createSelector(
  [cloudProviderIDSelector, regionSelector, awsCredentials],
  (cloudProviderID, region, awsCredentials) => ({
    cloudProviderID,
    region,
    credentials: awsCredentials,
  }),
);

export { vpcsSelector, vpcInquiryRequestSelector };
