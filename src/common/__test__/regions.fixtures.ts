import { AxiosResponse } from 'axios';
import type { FormikValues } from 'formik';

import { getAwsCcsCredentials } from '~/components/clusters/wizards/common/utils/ccsCredentials';
import { FieldId } from '~/components/clusters/wizards/osd/constants';
import { indexRegions, State as CcsInquiriesState } from '~/redux/reducers/ccsInquiriesReducer';
import type { State as CloudProvidersState } from '~/redux/reducers/cloudProvidersReducer';
import { baseRequestState } from '~/redux/reduxHelpers';
import type { CloudProvider, CloudRegion } from '~/types/clusters_mgmt.v1';

export const awsRegions: CloudRegion[] = [
  // To better test logic of choosing default:
  // - us-east-1 not first in the list.
  // - Most regions, including us-east-1, don't support hypershift.
  {
    id: 'eu-west-0',
    display_name: 'Avalon',
    enabled: true,
    ccs_only: false,
    supports_multi_az: true,
    govcloud: false,
    supports_hypershift: false,
  },
  {
    id: 'us-east-1',
    display_name: 'N. Virginia',
    enabled: true,
    ccs_only: false,
    supports_multi_az: true,
    govcloud: false,
    supports_hypershift: false,
  },
  {
    id: 'disabled-2',
    display_name: 'Kamchatka',
    enabled: false,
    ccs_only: false,
    supports_multi_az: true,
    govcloud: false,
    supports_hypershift: false,
  },
  {
    id: 'single-az-3',
    display_name: 'Antarctica',
    enabled: true,
    ccs_only: false,
    supports_multi_az: false,
    govcloud: false,
    supports_hypershift: false,
  },
  {
    id: 'ccs-only-4',
    display_name: 'Caucasia',
    enabled: true,
    ccs_only: true,
    supports_multi_az: true,
    govcloud: false,
    supports_hypershift: false,
  },
  {
    id: 'hypershift-5',
    display_name: 'Ho Chi Minh',
    enabled: true,
    ccs_only: false,
    supports_multi_az: true,
    govcloud: false,
    supports_hypershift: true,
  },
  {
    id: 'gov-6',
    display_name: 'Mount Rushmore',
    enabled: false,
    ccs_only: false,
    supports_multi_az: true,
    govcloud: true,
    supports_hypershift: false,
  },
  {
    id: 'version-dependent-7',
    display_name: 'New New York',
    enabled: false, // false in cloud_providers but see below, becomes enabled in inquiry
    ccs_only: true,
    supports_multi_az: true,
    govcloud: false,
    supports_hypershift: false,
  },
  // TODO: a region enabled: true for rhInfra but disabled in your AWS account for CCS.
];

// state.cloudProviders fixtures

export const noProviders: CloudProvidersState = {
  ...baseRequestState,
  providers: {},
};

export const rejectedProviders: CloudProvidersState = {
  ...noProviders,
  error: true,
  errorMessage: 'my message',
};

// Data as returned by API:
export const providersResponse: Partial<AxiosResponse<{ items: CloudProvider[] }>> = {
  status: 200,
  statusText: '',
  data: {
    items: [
      {
        id: 'aws',
        regions: awsRegions,
      },
    ],
  },
};

// Data as processed by getCloudProvidersAndRegions() action + reducer:
export const fulfilledProviders: CloudProvidersState = {
  ...noProviders,
  fulfilled: true,
  providers: {
    aws: {
      regions: indexRegions({ items: awsRegions }),
    },
  },
};

// state.ccsInquiries.regions fixtures

export const oldVersionCompatibleRegions = awsRegions.filter((region) => region.enabled);

export const newVersionCompatibleRegions = awsRegions
  .map((region) => ({
    ...region,
    enabled: region.enabled || region.id === 'version-dependent-7',
  }))
  .filter((region) => region.enabled);

export const noInquiryByVersion: CcsInquiriesState['regions'] = {
  ...baseRequestState,
  data: {
    byID: {},
  },
};

const inquiryByVersion = (formValues: FormikValues) => ({
  ...noInquiryByVersion,
  cloudProvider: 'aws',
  credentials: getAwsCcsCredentials(formValues),
  openshiftVersionId: formValues[FieldId.ClusterVersion].id,
});

export const rejectedInquiryByVersion = (
  formValues: FormikValues,
): CcsInquiriesState['regions'] => ({
  ...inquiryByVersion(formValues),
  error: true,
  errorMessage: 'my message',
});

export const fulfilledInquiryByVersion = (
  formValues: FormikValues,
  regionsArray: CloudRegion[],
): CcsInquiriesState['regions'] => ({
  ...inquiryByVersion(formValues),
  fulfilled: true,
  data: {
    byID: indexRegions({ items: regionsArray }),
  },
});
