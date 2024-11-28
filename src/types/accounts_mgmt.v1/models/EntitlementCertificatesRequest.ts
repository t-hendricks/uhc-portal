/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EntitlementCertificatesRequest = {
  arch?: Array<
    'x86' | 'x86_64' | 'ppc' | 'ppc64' | 'ppc64le' | 's390' | 's390x' | 'ia64' | 'aarch64'
  >;
  type: EntitlementCertificatesRequest.type;
};
export namespace EntitlementCertificatesRequest {
  export enum type {
    SCA = 'sca',
  }
}
