import get from 'lodash/get';

const hasAwsQuotaSelector = state => get(state, 'userProfile.organization.quotaList.clustersQuota.aws.isAvailable', false);
const hasGcpQuotaSelector = state => get(state, 'userProfile.organization.quotaList.clustersQuota.gcp.isAvailable', false);
const hasOSDQuotaSelector = state => hasAwsQuotaSelector(state) || hasGcpQuotaSelector(state);
const hasRHMIQuotaSelector = state => hasOSDQuotaSelector(state) && !!get(state, 'userProfile.organization.quotaList.addOnsQuota.addon-rhmi-operator', 0);

const awsQuotaSelector = state => get(state, 'userProfile.organization.quotaList.clustersQuota.aws', {
  byoc: {
    singleAz: {},
    multiAz: {},
    totalAvailable: 0,
  },
  rhInfra: {
    singleAz: {},
    multiAz: {},
    totalAvailable: 0,
  },
});

const gcpQuotaSelector = state => get(state, 'userProfile.organization.quotaList.clustersQuota.gcp', {
  rhInfra: {
    singleAz: {},
    multiAz: {},
    totalAvailable: 0,
  },
});

export {
  hasOSDQuotaSelector,
  hasRHMIQuotaSelector,
  hasAwsQuotaSelector,
  hasGcpQuotaSelector,
  awsQuotaSelector,
  gcpQuotaSelector,
};
