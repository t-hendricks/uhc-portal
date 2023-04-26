import React from 'react';
import { render, screen } from '@testUtils';
import * as ReleaseHooks from '~/components/releases/hooks';
import VersionSelection from '../VersionSelection';
import { ProductLifeCycle } from '~/types/product-life-cycles';

const useOCPLifeCycleStatusDataSpy = jest.spyOn(ReleaseHooks, 'useOCPLifeCycleStatusData');

describe('VersionSelection', () => {
  beforeAll(() => {
    useOCPLifeCycleStatusDataSpy.mockReturnValue(
      mockOCPLifeCycleStatusData as [ProductLifeCycle[] | undefined, boolean],
    );
  });

  it('does not show versions prior to "4.11" when hypershift and an ARN with a managed policy are selected', () => {
    render(
      <VersionSelection
        isOpen
        isRosa
        hasManagedArnsSelected
        isHypershiftSelected
        rosaMaxOSVersion="4.12"
        input={{ onChange: jest.fn() }}
        isDisabled={false}
        label="Version select label"
        meta={{ error: false, touched: false }}
        getInstallableVersions={jest.fn()}
        getInstallableVersionsResponse={getInstallableVersionsResponse}
        selectedClusterVersion={undefined}
      />,
    );

    expect(screen.getByRole('option', { name: '4.12.1' })).toBeVisible();
    expect(screen.getByRole('option', { name: '4.11.1' })).toBeVisible();
    expect(screen.queryByRole('option', { name: '4.10.1' })).not.toBeInTheDocument();
  });

  it('shows versions prior to "4.11" when hypershift is selected and no ARNs with managed policies are selected', () => {
    render(
      <VersionSelection
        isOpen
        isRosa
        isHypershiftSelected
        rosaMaxOSVersion="4.12"
        input={{ onChange: jest.fn() }}
        isDisabled={false}
        label="Version select label"
        meta={{ error: false, touched: false }}
        getInstallableVersions={jest.fn()}
        getInstallableVersionsResponse={getInstallableVersionsResponse}
        selectedClusterVersion={undefined}
      />,
    );

    expect(screen.getByRole('option', { name: '4.12.1' })).toBeVisible();
    expect(screen.getByRole('option', { name: '4.11.1' })).toBeVisible();
    expect(screen.getByRole('option', { name: '4.10.1' })).toBeVisible();
  });
});

const versions = [
  {
    ami_overrides: [],
    channel_group: 'stable',
    default: false,
    enabled: true,
    end_of_life_timestamp: '2024-03-17T00:00:00Z',
    hosted_control_plane_enabled: true,
    href: '/api/clusters_mgmt/v1/versions/openshift-v4.12.1',
    id: 'openshift-v4.12.1',
    kind: 'Version',
    raw_id: '4.12.1',
    release_image:
      'quay.io/openshift-release-dev/ocp-release@sha256:b9d6ccb5ba5a878141e468e56fa62912ad7c04864acfec0c0056d2b41e3259cc',
    rosa_enabled: true,
  },
  {
    ami_overrides: [],
    channel_group: 'stable',
    default: false,
    enabled: true,
    end_of_life_timestamp: '2024-03-17T00:00:00Z',
    hosted_control_plane_enabled: true,
    href: '/api/clusters_mgmt/v1/versions/openshift-v4.11.1',
    id: 'openshift-v4.11.1',
    kind: 'Version',
    raw_id: '4.11.1',
    release_image:
      'quay.io/openshift-release-dev/ocp-release@sha256:b9d6ccb5ba5a878141e468e56fa62912ad7c04864acfec0c0056d2b41e3259cc',
    rosa_enabled: true,
  },
  {
    ami_overrides: [],
    channel_group: 'stable',
    default: false,
    enabled: true,
    end_of_life_timestamp: '2024-03-17T00:00:00Z',
    hosted_control_plane_enabled: true,
    href: '/api/clusters_mgmt/v1/versions/openshift-v4.10.1',
    id: 'openshift-v4.10.1',
    kind: 'Version',
    raw_id: '4.10.1',
    release_image:
      'quay.io/openshift-release-dev/ocp-release@sha256:b9d6ccb5ba5a878141e468e56fa62912ad7c04864acfec0c0056d2b41e3259cc',
    rosa_enabled: true,
  },
];

const getInstallableVersionsResponse = {
  error: false,
  fulfilled: true,
  pending: false,
  valid: true,
  versions,
};

const mockOCPLifeCycleStatusData = [
  [
    {
      uuid: '0964595a-151e-4240-8a62-31e6c3730226',
      name: 'OpenShift Container Platform 4',
      former_names: [],
      show_last_minor_release: false,
      show_final_minor_release: false,
      is_layered_product: false,
      all_phases: [
        {
          name: 'General availability',
          ptype: 'normal',
          tooltip: undefined,
          display_name: 'General availability',
        },
        {
          name: 'Full support',
          ptype: 'normal',
          tooltip: undefined,
          display_name: 'Full support ends',
        },
        {
          name: 'Maintenance support',
          ptype: 'normal',
          tooltip: undefined,
          display_name: 'Maintenance support ends',
        },
        {
          name: 'Extended update support',
          ptype: 'normal',
          tooltip: undefined,
          display_name: 'Extended update support ends',
        },
        {
          name: 'Extended life phase',
          ptype: 'extended',
          tooltip:
            'The Extended Life Cycle Phase (ELP) is the post-retirement time period. We require that customers running Red Hat Enterprise Linux products beyond their retirement continue to have active subscriptions which ensures that they continue receiving access to all previously released content, documentation, and knowledge base articles as well as receive limited technical support. As there are no bug fixes, security fixes, hardware enablement, or root cause analysis available during the Extended Life Phase, customers may choose to purchase the Extended Life Cycle Support Add-On during the Extended Life Phase, which will provide them with critical impact security fixes and selected urgent priority bug fixes.',
          display_name: 'Extended life phase ends',
        },
      ],
      versions: [
        {
          name: '4.12',
          type: 'Full Support',
          last_minor_release: null,
          final_minor_release: null,
          extra_header_value: null,
          phases: [
            {
              name: 'General availability',
              date: '2023-01-17T00:00:00.000Z',
              date_format: 'date',
            },
            { name: 'Full support', date: 'Release of 4.13 + 3 months', date_format: 'string' },
            {
              name: 'Maintenance support',
              date: '2024-07-17T00:00:00.000Z',
              date_format: 'date',
            },
            {
              name: 'Extended update support',
              date: '2025-01-17T00:00:00.000Z',
              date_format: 'date',
            },
            { name: 'Extended life phase', date: '', date_format: 'string' },
          ],
          extra_dependences: [],
        },
        {
          name: '4.11',
          type: 'Maintenance Support',
          last_minor_release: null,
          final_minor_release: null,
          extra_header_value: null,
          phases: [
            {
              name: 'General availability',
              date: '2022-08-10T00:00:00.000Z',
              date_format: 'date',
            },
            { name: 'Full support', date: '2023-04-17T00:00:00.000Z', date_format: 'date' },
            {
              name: 'Maintenance support',
              date: '2024-02-10T00:00:00.000Z',
              date_format: 'date',
            },
            { name: 'Extended update support', date: 'N/A', date_format: 'string' },
            { name: 'Extended life phase', date: 'N/A', date_format: 'string' },
          ],
          extra_dependences: [],
        },
        {
          name: '4.10',
          type: 'Maintenance Support',
          last_minor_release: null,
          final_minor_release: null,
          extra_header_value: null,
          phases: [
            {
              name: 'General availability',
              date: '2022-03-10T00:00:00.000Z',
              date_format: 'date',
            },
            { name: 'Full support', date: '2022-11-10T00:00:00.000Z', date_format: 'date' },
            {
              name: 'Maintenance support',
              date: '2023-09-10T00:00:00.000Z',
              date_format: 'date',
            },
            { name: 'Extended update support', date: 'N/A', date_format: 'string' },
            { name: 'Extended life phase', date: 'N/A', date_format: 'string' },
          ],
          extra_dependences: [],
        },
      ],
      link: 'https://access.redhat.com/support/policy/updates/openshift/',
      policies: 'https://access.redhat.com/site/support/policy/updates/openshift/policies/',
    },
  ],
  true,
];
