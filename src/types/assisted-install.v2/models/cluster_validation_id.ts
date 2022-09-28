/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export enum cluster_validation_id {
  MACHINE_CIDR_DEFINED = 'machine-cidr-defined',
  CLUSTER_CIDR_DEFINED = 'cluster-cidr-defined',
  SERVICE_CIDR_DEFINED = 'service-cidr-defined',
  NO_CIDRS_OVERLAPPING = 'no-cidrs-overlapping',
  NETWORKS_SAME_ADDRESS_FAMILIES = 'networks-same-address-families',
  NETWORK_PREFIX_VALID = 'network-prefix-valid',
  MACHINE_CIDR_EQUALS_TO_CALCULATED_CIDR = 'machine-cidr-equals-to-calculated-cidr',
  API_VIP_DEFINED = 'api-vip-defined',
  API_VIP_VALID = 'api-vip-valid',
  INGRESS_VIP_DEFINED = 'ingress-vip-defined',
  INGRESS_VIP_VALID = 'ingress-vip-valid',
  ALL_HOSTS_ARE_READY_TO_INSTALL = 'all-hosts-are-ready-to-install',
  SUFFICIENT_MASTERS_COUNT = 'sufficient-masters-count',
  DNS_DOMAIN_DEFINED = 'dns-domain-defined',
  PULL_SECRET_SET = 'pull-secret-set',
  NTP_SERVER_CONFIGURED = 'ntp-server-configured',
  LSO_REQUIREMENTS_SATISFIED = 'lso-requirements-satisfied',
  OCS_REQUIREMENTS_SATISFIED = 'ocs-requirements-satisfied',
  ODF_REQUIREMENTS_SATISFIED = 'odf-requirements-satisfied',
  CNV_REQUIREMENTS_SATISFIED = 'cnv-requirements-satisfied',
  NETWORK_TYPE_VALID = 'network-type-valid',
}
