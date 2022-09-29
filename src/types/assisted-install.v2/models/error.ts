/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type error = {
  /**
   * Globally unique code of the error, composed of the unique identifier of the API and the numeric identifier of the error. For example, if the numeric identifier of the error is 93 and the identifier of the API is assisted_install then the code will be ASSISTED-INSTALL-93.
   */
  code: string;
  /**
   * Self link.
   */
  href: string;
  /**
   * Numeric identifier of the error.
   */
  id: number;
  /**
   * Indicates the type of this object. Will always be 'Error'.
   */
  kind: error.kind;
  /**
   * Human-readable description of the error.
   */
  reason: string;
};

export namespace error {
  /**
   * Indicates the type of this object. Will always be 'Error'.
   */
  export enum kind {
    ERROR = 'Error',
  }
}
