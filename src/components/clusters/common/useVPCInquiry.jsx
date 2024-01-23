import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import isEqual from 'lodash/isEqual';

import { useFormState } from '~/components/clusters/wizards/hooks';
import { FieldId } from '~/components/clusters/wizards/osd/constants';
import {
  vpcInquiryRequestSelector,
  vpcsSelector,
} from '~/components/clusters/common/v1VpcSelectors';
import { clearListVpcs, getAWSCloudProviderVPCs } from '~/redux/actions/ccsInquiriesActions';

export const isSubnetMatchingPrivacy = (subnet, privacy) =>
  !privacy || (privacy === 'public' && subnet.public) || (privacy === 'private' && !subnet.public);

export const lastVpcRequestIsInEffect = (vpcs, newRequest) => {
  if (!vpcs.fulfilled) {
    return false;
  }

  return (
    vpcs.cloudProvider === newRequest.cloudProviderID &&
    isEqual(vpcs.credentials, newRequest.credentials) &&
    vpcs.region === newRequest.region
  );
};

export const vpcHasPrivateSubnets = (vpc) =>
  (vpc.aws_subnets || []).some((subnet) => isSubnetMatchingPrivacy(subnet, 'private'));

/**
 * Returns only the VPCs that are not managed by Red Hat

 * @param vpcs list of VPC items
 * @returns {*} copy of the VPC list
 */
export const filterOutRedHatManagedVPCs = (vpcs) =>
  vpcs.filter((vpcItem) => !vpcItem.red_hat_managed);

/**
 * Generates the request parameters to obtain the customer's VPC.
 * Valid only for Formik Wizard.
 * If invoked from Redux-form, it will throw an error.
 *
 * @returns {object} request params for the VPCs
 */
const useFormikVPCRequest = () => {
  const { values } = useFormState();
  return {
    region: values[FieldId.Region],
    cloudProviderID: values[FieldId.CloudProvider],
    credentials: {
      account_id: values[FieldId.AccountId],
      access_key_id: values[FieldId.AccessKeyId],
      secret_access_key: values[FieldId.SecretAccessKey],
    },
  };
};

/**
 * Generates the request parameters to obtain the customer's VPC.
 * Valid only for Redux-form Wizard.
 *
 * @returns {object} request params for the VPCs
 */
const useReduxVPCRequest = () => useSelector(vpcInquiryRequestSelector);

/**
 * React hook fetching VPCs on mount and when dependencies change.
 * - Works for either Redux-form or Formik clusters
 * - Does nothing if GCP selected.
 * @param isOSD Determines the form type
 * @returns current vpcs state.
 */
export const useAWSVPCInquiry = (isOSD) => {
  const dispatch = useDispatch();
  const vpcs = useSelector(vpcsSelector);

  // We must fetch the data from the form state, either the Redux-Form or Formik state.
  // Formik's "useFormState" will crash when invoked from the Redux-Form wizard
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const requestParams = isOSD ? useFormikVPCRequest() : useReduxVPCRequest();
  const hasLatestVpcs = lastVpcRequestIsInEffect(vpcs, requestParams);

  const { region, cloudProviderID, credentials } = requestParams;

  useEffect(() => {
    // The action works similarly for AWS and GCP,
    // but current GCP components don't need it, they fetch the data themselves.
    if (cloudProviderID === 'aws' && !hasLatestVpcs) {
      // Clear stale error state before re-fetching VPCs
      if (vpcs.error) {
        dispatch(clearListVpcs());
      }

      dispatch(
        getAWSCloudProviderVPCs({
          region,
          awsCredentials: credentials,
          options: { includeSecurityGroups: true },
        }),
      );
    }
    // Adding "credentials" will trigger more than 1 request when the component first receives its data
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloudProviderID, region, hasLatestVpcs]);
  return { vpcs, requestParams };
};
