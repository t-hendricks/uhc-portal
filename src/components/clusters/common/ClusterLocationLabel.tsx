// ClusterLocationLabel shows the location of the cluster in the form of
// "Cloud Provider (location name)".

import React from 'react';
import { useDispatch } from 'react-redux';

import { getCloudProviders } from '~/redux/actions/cloudProviderActions';
import { useGlobalState } from '~/redux/hooks';

export type ClusterLocationLabelProps = {
  regionID: string;
  cloudProviderID: string;
};
const ClusterLocationLabel = ({ regionID, cloudProviderID }: ClusterLocationLabelProps) => {
  const dispatch = useDispatch();
  const cloudProviders = useGlobalState((state) => state.cloudProviders);

  React.useEffect(() => {
    if (!cloudProviders.pending && !cloudProviders.error && !cloudProviders.fulfilled) {
      dispatch(getCloudProviders());
    }
  }, [dispatch, cloudProviders]);

  return (
    <>
      {cloudProviders.fulfilled && cloudProviders.providers[cloudProviderID]
        ? cloudProviders.providers[cloudProviderID].display_name
        : cloudProviderID.toUpperCase()}
      {regionID !== 'N/A' && ` (${regionID})`}
    </>
  );
};

export default ClusterLocationLabel;
