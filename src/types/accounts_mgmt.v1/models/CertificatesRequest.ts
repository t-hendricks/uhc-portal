/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CertificatesRequest = {
  arch?: CertificatesRequest.arch;
  type: CertificatesRequest.type;
};

export namespace CertificatesRequest {
  export enum arch {
    X86 = 'x86',
    X86_64 = 'x86_64',
    PPC = 'ppc',
    PPC64 = 'ppc64',
    PPC64LE = 'ppc64le',
    S390 = 's390',
    S390X = 's390x',
    IA64 = 'ia64',
    AARCH64 = 'aarch64',
  }

  export enum type {
    SCA = 'sca',
  }
}
