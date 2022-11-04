/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { VersionGate } from './VersionGate';

/**
 * VersionGateAgreement represents a version gate that the user agreed to for a specific cluster.
 */
export type VersionGateAgreement = {
  /**
   * Indicates the type of this object. Will be 'VersionGateAgreement' if this is a complete object or 'VersionGateAgreementLink' if it is just a link.
   */
  kind?: string;
  /**
   * Unique identifier of the object.
   */
  id?: string;
  /**
   * Self link.
   */
  href?: string;
  /**
   * The time the user agreed to the version gate
   */
  agreed_timestamp?: string;
  /**
   * link to the version gate that the user agreed to
   */
  version_gate?: VersionGate;
};
