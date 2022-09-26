/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * The ordering to apply to the report. Default is ascending order for the data.
 */
export type ReportCostsOpenShiftOrdering = {
  cluster?: ReportCostsOpenShiftOrdering.cluster;
  project?: ReportCostsOpenShiftOrdering.project;
  node?: ReportCostsOpenShiftOrdering.node;
  infrastructure?: ReportCostsOpenShiftOrdering.infrastructure;
  supplementary?: ReportCostsOpenShiftOrdering.supplementary;
  cost?: ReportCostsOpenShiftOrdering.cost;
};

export namespace ReportCostsOpenShiftOrdering {
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
}
