import get from 'lodash/get';

const hasOSDQuota = (state) => {
  const awsQuotaAvailable = get(state, 'userProfile.organization.quotaList.clustersQuota.aws.available', false);
  const gcpQuotaAvailable = get(state, 'userProfile.organization.quotaList.clustersQuota.gcp.available', false);

  return awsQuotaAvailable || gcpQuotaAvailable;
};

export default hasOSDQuota;
