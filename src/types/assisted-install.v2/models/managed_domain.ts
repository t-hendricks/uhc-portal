/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type managed_domain = {
  domain?: string;
  provider?: managed_domain.provider;
};

export namespace managed_domain {
  export enum provider {
    ROUTE53 = 'route53',
  }
}
