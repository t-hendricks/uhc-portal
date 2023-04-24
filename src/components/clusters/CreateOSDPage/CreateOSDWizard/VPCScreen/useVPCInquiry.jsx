import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { isEqual } from 'lodash';

import ccsCredentialsSelector from '../credentialsSelector';
import { clearListVpcs, getAWSCloudProviderVPCs } from '../ccsInquiriesActions';

const valueSelector = formValueSelector('CreateCluster');

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
 * React hook fetching VPCs on mount and when dependencies change.
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
  const { credentials: vpcsCredentials, error: vpcsError } = vpcs;

  // When vpcs subnet availability zones possess the current selected region and current
  // CCS credentials match what's stored for vpcs, vpcs results can be considered up-to-date.
  const vpcsHasLatestCredentials =
    vpcsCredentials?.sts?.role_arn === credentials?.sts?.role_arn ||
    (vpcsCredentials?.access_key_id === credentials?.access_key_id &&
      vpcsCredentials?.secret_access_key === credentials?.secret_access_key);
  const hasLatestVpcs =
    Object.values(vpcs.data?.bySubnetID || {})?.some((subnet) =>
      subnet.availability_zone.includes(region),
    ) && vpcsHasLatestCredentials;

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
