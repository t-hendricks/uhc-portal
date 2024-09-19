import * as React from 'react';
import { Form, Formik, FormikValues } from 'formik';

import { billingModels } from '~/common/subscriptionTypes';
import { VersionSelectField } from '~/components/clusters/wizards/common/ClusterSettings/Details/VersionSelectField';
import {
  lifecycleResponseData,
  versionsData,
} from '~/components/clusters/wizards/common/ClusterSettings/Details/VersionSelectField.fixtures';
import { FieldId } from '~/components/clusters/wizards/common/constants';
import { GCPAuthType } from '~/components/clusters/wizards/osd/ClusterSettings/CloudProvider/types';
import { UNSTABLE_CLUSTER_VERSIONS } from '~/redux/constants/featureConstants';
import clusterService from '~/services/clusterService';
import getOCPLifeCycleStatus from '~/services/productLifeCycleService';
import { checkAccessibility, screen, withState } from '~/testUtils';

jest.mock('~/services/productLifeCycleService');
jest.mock('~/services/clusterService');

const standardValues: FormikValues = {
  [FieldId.BillingModel]: billingModels.STANDARD,
};
const clusterVersionValue: FormikValues = {
  [FieldId.ClusterVersion]: versionsData[0],
};
const standardValuesWithVersion: FormikValues = {
  ...standardValues,
  ...clusterVersionValue,
};
const marketplaceGcpValues = {
  [FieldId.BillingModel]: billingModels.MARKETPLACE_GCP,
};
const wifValues = {
  [FieldId.BillingModel]: billingModels.STANDARD,
  [FieldId.GcpAuthType]: GCPAuthType.WorkloadIdentityFederation,
};

describe('<VersionSelectField />', () => {
  const notLoaded = {
    fulfilled: false,
    error: false,
    pending: false,
    versions: versionsData,
  };
  const loaded = {
    ...notLoaded,
    fulfilled: true,
    meta: {
      isMarketplaceGcp: false,
      isWIF: false,
      includeUnstableVersions: false,
    },
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
    features: {
      [UNSTABLE_CLUSTER_VERSIONS]: false,
    },
  };
  const loadedStateUnmatchedVersions = {
    ...loadedState,
    clusters: {
      clusterVersions: {
        ...loaded,
        meta: {
          isRosa: true,
        },
      },
    },
  };
  const defaultProps = {
    name: FieldId.ClusterVersion,
    label: 'Version',
    isDisabled: false,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    (getOCPLifeCycleStatus as jest.Mock).mockReturnValue({ data: lifecycleResponseData });
    (clusterService.getInstallableVersions as jest.Mock).mockReturnValue({
      data: { items: versionsData, kind: 'VersionList', page: 1, size: 1, total: 3 },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    ['with no params', standardValues, false, false, false],
    ['for GCP marketplace', marketplaceGcpValues, true, false, false],
    ['for WIF authentication', wifValues, false, true, false],
  ])(
    'fetches cluster version %s',
    async (title, formikValues, isMarketplaceGcp, isWIF, includeUnstableVersions) => {
      withState(notLoadedState).render(
        <Formik initialValues={formikValues} onSubmit={() => {}}>
          <VersionSelectField {...defaultProps} />
        </Formik>,
      );

      expect(clusterService.getInstallableVersions).toHaveBeenCalledWith({
        isMarketplaceGcp,
        isWIF,
        includeUnstableVersions,
      });
      expect(await screen.findByText('Version')).toBeInTheDocument();
    },
  );

  it('re-fetches cluster versions and reset selected version if the versions available do not match the existing cluster type', async () => {
    const onSubmit = jest.fn();
    const { user } = withState(loadedStateUnmatchedVersions).render(
      <Formik initialValues={standardValuesWithVersion} onSubmit={onSubmit}>
        <Form>
          <VersionSelectField {...defaultProps} />
          <button type="submit">Submit</button>
        </Form>
      </Formik>,
    );

    expect(clusterService.getInstallableVersions).toHaveBeenCalledWith({
      isMarketplaceGcp: false,
      isWIF: false,
      includeUnstableVersions: false,
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.not.objectContaining(clusterVersionValue),
      expect.anything(),
    );
  });

  it('is accessible', async () => {
    const { container } = withState(loadedState).render(
      <Formik initialValues={standardValues} onSubmit={() => {}}>
        <VersionSelectField {...defaultProps} />
      </Formik>,
    );

    expect(await screen.findByText('Version')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('shows the right default version', async () => {
    withState(loadedState).render(
      <Formik initialValues={standardValues} onSubmit={() => {}}>
        <VersionSelectField {...defaultProps} />
      </Formik>,
    );

    expect(clusterService.getInstallableVersions).not.toHaveBeenCalled();
    expect(await screen.findByText('Version')).toBeInTheDocument();
    expect(screen.queryByText('4.13.1')).not.toBeInTheDocument();
    expect(await screen.findByText('4.12.13')).toBeInTheDocument();
  });

  it('handles opening the toggle', async () => {
    const { container, user } = withState(loadedState).render(
      <Formik initialValues={standardValues} onSubmit={() => {}}>
        <VersionSelectField {...defaultProps} />
      </Formik>,
    );

    expect(clusterService.getInstallableVersions).not.toHaveBeenCalled();
    expect(screen.queryByText('Version')).toBeInTheDocument();
    expect(container.querySelector('fieldset')).not.toBeInTheDocument();
    const menuToggle = container.querySelector('#version-selector')!;
    expect(menuToggle).toBeInTheDocument();
    await user.click(menuToggle);
    expect(container.querySelector('fieldset')).toBeInTheDocument();
  });
});
