import * as React from 'react';
import { Formik, FormikValues } from 'formik';

import { withState, screen } from '~/testUtils';
import { Version } from '~/types/clusters_mgmt.v1';
import clusterService from '~/services/clusterService';
import { billingModels } from '~/common/subscriptionTypes';
import { FieldId } from '~/components/clusters/wizards/common/constants';
import { VersionSelectField } from '~/components/clusters/wizards/common/ClusterSettings/Details/VersionSelectField';

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

const standardValues: FormikValues = {
  [FieldId.BillingModel]: billingModels.STANDARD,
};
const marketplaceGcpValues = {
  [FieldId.BillingModel]: billingModels.MARKETPLACE_GCP,
};

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

  it('to call clusterService.getInstallableVersions with: isRosa false, isMarketplaceGcp false', async () => {
    withState(notLoadedState).render(
      <Formik initialValues={standardValues} onSubmit={() => {}}>
        <VersionSelectField {...defaultProps} />
      </Formik>,
    );

    expect(getInstallableVersionsSpy).toHaveBeenCalledWith(false, false, false);
  });

  it('to call clusterService.getInstallableVersions with: isRosa false, isMarketplaceGcp true', async () => {
    withState(notLoadedState).render(
      <Formik initialValues={marketplaceGcpValues} onSubmit={() => {}}>
        <VersionSelectField {...defaultProps} />
      </Formik>,
    );

    expect(getInstallableVersionsSpy).toHaveBeenCalledWith(false, true, false);
  });

  it.skip('to shows the right default version', async () => {
    // NOTE: the skipped tests are failing because by using await screen.findByText
    // is causing the tests to return with the following error:
    // thrown: Object {
    //   "status": 500,
    // }

    // Further investigation is needed but it maybe that if the
    // test wait for all the state changes, a child item is hitting
    // something that isn't mocked correctly.
    withState(loadedState).render(
      <Formik initialValues={standardValues} onSubmit={() => {}}>
        <VersionSelectField {...defaultProps} />
      </Formik>,
    );
    expect(screen.queryByText('4.13.1')).not.toBeInTheDocument();
    expect(await screen.findByText('4.12.13')).toBeInTheDocument();
  });

  it.skip('to open the toggle', async () => {
    // NOTE: the skipped tests are failing because by using await screen.findByText
    // is causing the tests to return with the following error:
    // thrown: Object {
    //   "status": 500,
    // }

    // Further investigation is needed but it maybe that if the
    // test wait for all the state changes, a child item is hitting
    // something that isn't mocked correctly.
    const { container, user } = withState(loadedState).render(
      <Formik initialValues={standardValues} onSubmit={() => {}}>
        <VersionSelectField {...defaultProps} />
      </Formik>,
    );

    expect(screen.queryByText('Version (Google Cloud Marketplace enabled)')).toBeInTheDocument();
    expect(container.querySelector('fieldset')).not.toBeInTheDocument();
    const menuToggle = container.querySelector('#version-selector')!;
    expect(menuToggle).toBeInTheDocument();
    await user.click(menuToggle);
    expect(container.querySelector('fieldset')).toBeInTheDocument();
  });
});
