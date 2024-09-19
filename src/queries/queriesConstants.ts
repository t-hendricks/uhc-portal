export const queryConstants = {
  STALE_TIME: 30000,
  STALE_TIME_60_SEC: 60000,
  REFETCH_INTERVAL: undefined, // never refetch
  API_PAGE_SIZE: 500,
  FETCH_CLUSTERS_QUERY_KEY: 'fetchClusters',
  FETCH_CLUSTER_DETAILS_QUERY_KEY: 'fetchClusterDetails',
  FETCH_CLUSTER_LOGS_QUERY_KEY: 'fetchClusterLogs',
  FETCH_CLUSTER_STATUS_MONITOR_INFLIGHT_CHECKS: 'fetchClusterStatusMonitorInflightChecks',
  FETCH_CLUSTERS_REFETCH_INTERVAL: 60000, // milliseconds
  FETCH_REGIONALIZED_MULTI_REGIONS: 'fetchRegionalizedMultiRegions',
  FETCH_SEARCH_CLUSTER_NAME: 'fetchSearchClusterName',
  FETCH_SEARCH_DOMAIN_PREFIX: 'fetchSearchDomainPrefix',
  FETCH_GET_OCM_ROLE: 'fetchGetOCMRole',
  FETCH_GET_USER_OIDC_CONFIGURATIONS: 'fetchGetOidcConfigurations',
};
