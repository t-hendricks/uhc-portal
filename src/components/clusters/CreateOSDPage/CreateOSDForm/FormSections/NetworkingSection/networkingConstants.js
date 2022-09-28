export const MACHINE_CIDR_DEFAULT = '10.0.0.0/16';
export const SERVICE_CIDR_DEFAULT = '172.30.0.0/16';
export const HOST_PREFIX_DEFAULT = '/23';
export const HTTP_PROXY_PLACEHOLDER = 'http://<user>:<password>@<ipaddr>:<port>';
export const HTTPS_PROXY_PLACEHOLDER = 'http(s)://<user>:<password>@<ipaddr>:<port>';
export const TRUST_BUNDLE_PLACEHOLDER = `-----BEGIN CERTIFICATE-----
<MY_TRUSTED_CA_CERT>
-----END CERTIFICATE-----`;

export const podCidrDefaultValue = (cloudProviderID) =>
  `10.128.0.0/${cloudProviderID === 'aws' ? '16' : '14'}`;
