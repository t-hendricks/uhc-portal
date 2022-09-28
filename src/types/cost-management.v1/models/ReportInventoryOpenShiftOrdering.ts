/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * The ordering to apply to the report. Default is ascending order for the data.
 */
export type ReportInventoryOpenShiftOrdering = {
  cluster?: ReportInventoryOpenShiftOrdering.cluster;
  project?: ReportInventoryOpenShiftOrdering.project;
  node?: ReportInventoryOpenShiftOrdering.node;
  usage?: ReportInventoryOpenShiftOrdering.usage;
  request?: ReportInventoryOpenShiftOrdering.request;
  infrastructure?: ReportInventoryOpenShiftOrdering.infrastructure;
  supplementary?: ReportInventoryOpenShiftOrdering.supplementary;
  cost?: ReportInventoryOpenShiftOrdering.cost;
  limit?: ReportInventoryOpenShiftOrdering.limit;
};

export namespace ReportInventoryOpenShiftOrdering {
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

  export enum usage {
    ASC = 'asc',
    DESC = 'desc',
  }

  export enum request {
    ASC = 'asc',
    DESC = 'desc',
  }

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

  export enum limit {
    ASC = 'asc',
    DESC = 'desc',
  }
}
