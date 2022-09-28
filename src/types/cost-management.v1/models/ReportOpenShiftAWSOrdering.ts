/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * The ordering to apply to the report. Default is ascending order for the data.
 */
export type ReportOpenShiftAWSOrdering = {
  infrastructure?: ReportOpenShiftAWSOrdering.infrastructure;
  supplementary?: ReportOpenShiftAWSOrdering.supplementary;
  cost?: ReportOpenShiftAWSOrdering.cost;
  usage?: ReportOpenShiftAWSOrdering.usage;
  delta?: ReportOpenShiftAWSOrdering.delta;
  account_alias?: ReportOpenShiftAWSOrdering.account_alias;
  region?: ReportOpenShiftAWSOrdering.region;
  service?: ReportOpenShiftAWSOrdering.service;
  cluster?: ReportOpenShiftAWSOrdering.cluster;
  project?: ReportOpenShiftAWSOrdering.project;
  node?: ReportOpenShiftAWSOrdering.node;
};

export namespace ReportOpenShiftAWSOrdering {
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

  export enum cluster {
    ASC = 'asc',
    DESC = 'desc',
  }

  export enum project {
    ASC = 'asc',
    DESC = 'desc',
  }

  export enum node {
    ASC = 'asc',
    DESC = 'desc',
  }
}
