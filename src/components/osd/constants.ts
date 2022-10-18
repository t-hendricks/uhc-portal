import { billingModels } from '~/common/subscriptionTypes';

export enum FieldId {
  BillingModel = 'billing_model',
  Byoc = 'byoc',
  Product = 'product',
  MultiAz = 'multi_az',
}

export enum StepName {
  BillingModel = 'Billing model',
  Review = 'Review and create',
}

export enum StepId {
  BillingModel = 'billing-model',
  Review = 'review',
}

export enum UrlPath {
  Create = '/create',
  CreateOsd = '/create/osd',
  CreateCloud = '/create/cloud',
}

export const breadcrumbs = [
  { label: 'Clusters' },
  { label: 'Create', path: UrlPath.Create },
  { label: 'OpenShift Dedicated', path: UrlPath.CreateOsd },
];

export const initialValues = {
  billing_model: billingModels.STANDARD,
  byoc: 'false',
};
