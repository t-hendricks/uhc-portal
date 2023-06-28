import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { isEqual } from 'lodash';

import ccsCredentialsSelector from '../credentialsSelector';
import { clearListVpcs, getAWSCloudProviderVPCs } from '../ccsInquiriesActions';

const valueSelector = formValueSelector('CreateCluster');

export const isSubnetMatchingPrivacy = (subnet, privacy) =>
  !privacy || (privacy === 'public' && subnet.public) || (privacy === 'private' && !subnet.public);

export const isVPCInquiryValid = (state) => {
  const { vpcs } = state.ccsInquiries;
  if (!vpcs.fulfilled) {
    return false;
  }
  const cloudProviderID = valueSelector(state, 'cloud_provider');
  const credentials = ccsCredentialsSelector(cloudProviderID, state);
  const region = valueSelector(state, 'region');
  return (
    vpcs.cloudProvider === cloudProviderID &&
    isEqual(vpcs.credentials, credentials) &&
    vpcs.region === region
  );
};

/**
 * Returns a modified copy of the VPC list where:
 * - The subnets are filtered, containing those that are private
 * - The VPC list is sorted, having first the VPCs that have at least 1 private subnet, then the rest

 * @param vpcs list of VPC items
 * @returns {*} copy of the VPC list
 */
export const filterVpcsOnlyPrivateSubnets = (vpcs) =>
  vpcs
    .map((vpcItem) => {
      const filteredSubnets = (vpcItem.aws_subnets || []).filter((subnet) =>
        isSubnetMatchingPrivacy(subnet, 'private'),
      );
      return {
        ...vpcItem,
        aws_subnets: filteredSubnets,
      };
    })
    .sort((vpcA, vpcB) => {
      const hasSubnetsA = vpcA.aws_subnets.length > 0;
      const hasSubnetsB = vpcB.aws_subnets.length > 0;
      if (hasSubnetsA && !hasSubnetsB) {
        return -1;
      }
      if (hasSubnetsB && !hasSubnetsA) {
        return 1;
      }
      return 0;
    });

/**
 * React hook fetching VPCs on mount and when dependencies change.
 * Request args extracted from redux-form state.
 * Does nothing if GCP selected.
 * @returns current vpcs state.
 */
export const useAWSVPCInquiry = () => {
  const dispatch = useDispatch();
  const cloudProviderID = useSelector((state) => valueSelector(state, 'cloud_provider'));
  const credentials = useSelector(
    (state) => ccsCredentialsSelector(cloudProviderID, state),
    isEqual, // TODO: memoize ccsCredentialsSelector itself?
  );
  const region = useSelector((state) => valueSelector(state, 'region'));
  const vpcs = useSelector((state) => state.ccsInquiries.vpcs);
  const { error: vpcsError } = vpcs;

  const hasLatestVpcs = useSelector(isVPCInquiryValid);

  useEffect(() => {
    // The action works similarly for AWS and GCP,
    // but current GCP components don't need it, they fetch the data themselves.
    if (cloudProviderID === 'aws' && !hasLatestVpcs) {
      // Clear stale error state before re-fetching VPCs
      if (vpcsError) {
        dispatch(clearListVpcs());
      }

      dispatch(getAWSCloudProviderVPCs(credentials, region));
    }
  }, [cloudProviderID, credentials, region, hasLatestVpcs]);

  return vpcs;
};
