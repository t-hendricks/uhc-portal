/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CertificateSerial } from './CertificateSerial';
export type EntitlementCertificate = {
  cert: string;
  id: string;
  key: string;
  metadata: Record<string, string>;
  organization_id: string;
  serial: CertificateSerial;
};
