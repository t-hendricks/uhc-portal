/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The ordering to apply to the report. Default is ascending order for the data.
 */
export type ReportAWSEC2ComputeOrdering = {
  cost?: ReportAWSEC2ComputeOrdering.cost;
  usage?: ReportAWSEC2ComputeOrdering.usage;
  account?: ReportAWSEC2ComputeOrdering.account;
  operating_system?: ReportAWSEC2ComputeOrdering.operating_system;
  resource_id?: ReportAWSEC2ComputeOrdering.resource_id;
  instance_name?: ReportAWSEC2ComputeOrdering.instance_name;
  instance_type?: ReportAWSEC2ComputeOrdering.instance_type;
};
export namespace ReportAWSEC2ComputeOrdering {
  export enum cost {
    ASC = 'asc',
    DESC = 'desc',
  }
  export enum usage {
    ASC = 'asc',
    DESC = 'desc',
  }
  export enum account {
    ASC = 'asc',
    DESC = 'desc',
  }
  export enum operating_system {
    ASC = 'asc',
    DESC = 'desc',
  }
  export enum resource_id {
    ASC = 'asc',
    DESC = 'desc',
  }
  export enum instance_name {
    ASC = 'asc',
    DESC = 'desc',
  }
  export enum instance_type {
    ASC = 'asc',
    DESC = 'desc',
  }
}
