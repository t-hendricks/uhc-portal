/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * The ordering to apply to the report. Default is ascending order for the data.
 */
export type ReportOrdering = {
  infrastructure?: ReportOrdering.infrastructure;
  supplementary?: ReportOrdering.supplementary;
  cost?: ReportOrdering.cost;
  usage?: ReportOrdering.usage;
  delta?: ReportOrdering.delta;
  account_alias?: ReportOrdering.account_alias;
  region?: ReportOrdering.region;
  service?: ReportOrdering.service;
};

export namespace ReportOrdering {
  export enum infrastructure {
    ASC = 'asc',
    DESC = 'desc',
  }

  export enum supplementary {
    ASC = 'asc',
    DESC = 'desc',
  }

  export enum cost {
    ASC = 'asc',
    DESC = 'desc',
  }

  export enum usage {
    ASC = 'asc',
    DESC = 'desc',
  }

  export enum delta {
    ASC = 'asc',
    DESC = 'desc',
  }

  export enum account_alias {
    ASC = 'asc',
    DESC = 'desc',
  }

  export enum region {
    ASC = 'asc',
    DESC = 'desc',
  }

  export enum service {
    ASC = 'asc',
    DESC = 'desc',
  }
}
