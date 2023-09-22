import * as React from 'react';
import { Formik } from 'formik';
import { fireEvent, render } from '~/testUtils';
import { screen } from '@testing-library/dom';
import { Version } from '~/types/clusters_mgmt.v1';
import clusterService from '~/services/clusterService';
import { billingModels } from '~/common/subscriptionTypes';
import { FieldId, initialValues } from '../../constants';
import { VersionSelectField } from './VersionSelectField';

const getInstallableVersionsSpy = jest.spyOn(clusterService, 'getInstallableVersions');

const data: Version[] = [
  {
    kind: 'Version',
    raw_id: '4.13.1',
    enabled: true,
    default: false,
    channel_group: 'stable',
    rosa_enabled: true,
    hosted_control_plane_enabled: true,
    gcp_marketplace_enabled: true,
    end_of_life_timestamp: '2024-09-17T00:00:00Z',
  },
  {
    kind: 'Version',
    raw_id: '4.12.13',
    enabled: true,
    default: true,
    channel_group: 'stable',
    rosa_enabled: true,
    hosted_control_plane_enabled: true,
    gcp_marketplace_enabled: true,
    end_of_life_timestamp: '2024-09-17T00:00:00Z',
  },
  {
    kind: 'Version',
    raw_id: '4.12.12',
    enabled: true,
    default: false,
    channel_group: 'stable',
    rosa_enabled: true,
    hosted_control_plane_enabled: true,
    gcp_marketplace_enabled: true,
    end_of_life_timestamp: '2024-09-17T00:00:00Z',
  },
];

describe('<VersionSelectField />', () => {
  const notLoaded = {
    fulfilled: false,
    error: false,
    pending: false,
    versions: data,
  };
  const loaded = {
    ...notLoaded,
    fulfilled: true,
  };
  const notLoadedState = {
    clusters: {
      clusterVersions: notLoaded,
    },
  };
  const loadedState = {
    clusters: {
      clusterVersions: loaded,
    },
  };
  const defaultProps = {
    name: FieldId.ClusterVersion,
    label: 'Version (Google Cloud Marketplace enabled)',
    isDisabled: false,
  };
  const defaultValues = {
    ...initialValues,
  };

  it('to call clusterService.getInstallableVersions with: isRosa false, isMarketplaceGcp false', async () => {
    render(
      <Formik initialValues={defaultValues} onSubmit={() => {}}>
        <VersionSelectField {...defaultProps} />
      </Formik>,
      {},
      notLoadedState,
    );

    expect(getInstallableVersionsSpy).toHaveBeenCalledWith(false, false);
  });

  it('to call clusterService.getInstallableVersions with: isRosa false, isMarketplaceGcp true', async () => {
    const marketplaceGcpValues = {
      ...initialValues,
      [FieldId.BillingModel]: billingModels.MARKETPLACE_GCP,
    };
    render(
      <Formik initialValues={marketplaceGcpValues} onSubmit={() => {}}>
        <VersionSelectField {...defaultProps} />
      </Formik>,
      {},
      notLoadedState,
    );

    expect(getInstallableVersionsSpy).toHaveBeenCalledWith(false, true);
  });

  it('to shows the right default version', async () => {
    render(
      <Formik initialValues={defaultValues} onSubmit={() => {}}>
        <VersionSelectField {...defaultProps} />
      </Formik>,
      {},
      loadedState,
    );

    expect(screen.queryByText('4.13.1')).not.toBeInTheDocument();
    expect(screen.queryByText('4.12.13')).toBeInTheDocument();
  });

  it('to open the toggle', async () => {
    const { container } = render(
      <Formik initialValues={defaultValues} onSubmit={() => {}}>
        <VersionSelectField {...defaultProps} />
      </Formik>,
      {},
      loadedState,
    );

    expect(screen.queryByText('Version (Google Cloud Marketplace enabled)')).toBeInTheDocument();
    expect(screen.queryByText('4.13.1')).not.toBeInTheDocument();
    expect(screen.queryByText('4.12.12')).not.toBeInTheDocument();
    const menuToggle = container.querySelector('#version-selector')!;
    expect(menuToggle).toBeInTheDocument();
    fireEvent.click(menuToggle);
    expect(screen.queryByText('4.13.1')).toBeInTheDocument();
    expect(screen.queryByText('4.12.12')).toBeInTheDocument();
  });
});
