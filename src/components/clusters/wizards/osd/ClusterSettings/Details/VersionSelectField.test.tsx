import * as React from 'react';
import { Formik } from 'formik';

import { withState, screen, fireEvent } from '~/testUtils';
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
    id: '4.13.1',
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
    id: '4.12.13',
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
    id: '4.12.12',
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
    onChange: jest.fn(),
  };
  const defaultValues = {
    ...initialValues,
  };

  it('to call clusterService.getInstallableVersions with: isRosa false, isMarketplaceGcp false', async () => {
    withState(notLoadedState).render(
      <Formik initialValues={defaultValues} onSubmit={() => {}}>
        <VersionSelectField {...defaultProps} />
      </Formik>,
    );

    expect(getInstallableVersionsSpy).toHaveBeenCalledWith(false, false, false);
  });

  it('to call clusterService.getInstallableVersions with: isRosa false, isMarketplaceGcp true', async () => {
    const marketplaceGcpValues = {
      ...initialValues,
      [FieldId.BillingModel]: billingModels.MARKETPLACE_GCP,
    };
    withState(notLoadedState).render(
      <Formik initialValues={marketplaceGcpValues} onSubmit={() => {}}>
        <VersionSelectField {...defaultProps} />
      </Formik>,
    );

    expect(getInstallableVersionsSpy).toHaveBeenCalledWith(false, true, false);
  });

  it('to shows the right default version', async () => {
    withState(loadedState).render(
      <Formik initialValues={defaultValues} onSubmit={() => {}}>
        <VersionSelectField {...defaultProps} />
      </Formik>,
    );
    expect(screen.queryByText('4.13.1')).not.toBeInTheDocument();
    expect(screen.queryByText('4.12.13')).toBeInTheDocument();
  });

  it('to open the toggle', async () => {
    const { container } = withState(loadedState).render(
      <Formik initialValues={defaultValues} onSubmit={() => {}}>
        <VersionSelectField {...defaultProps} />
      </Formik>,
    );

    expect(screen.queryByText('Version (Google Cloud Marketplace enabled)')).toBeInTheDocument();
    expect(container.querySelector('fieldset')).not.toBeInTheDocument();
    const menuToggle = container.querySelector('#version-selector')!;
    expect(menuToggle).toBeInTheDocument();
    // eslint-disable-next-line testing-library/prefer-user-event
    fireEvent.click(menuToggle);
    expect(container.querySelector('fieldset')).toBeInTheDocument();
  });
});
