/* eslint-disable import/prefer-default-export */
// placeholder texts representing default values for advanced networking settings

export const MACHINE_CIDR_PLACEHOLDER = '10.0.0.0/16';
export const SERVICE_CIDR_PLACEHOLDER = '172.30.0.0/16';
export const HOST_PREFIX_PLACEHOLDER = '/23';

export const podCidrPlaceholder = cloudProviderID => `10.128.0.0/${cloudProviderID === 'aws' ? '16' : '14'}`;
