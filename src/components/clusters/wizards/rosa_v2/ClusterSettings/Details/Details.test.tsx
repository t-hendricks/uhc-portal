// Some components under Details have their own tests;
// this file tries to take a more "black box integration" approach.

import * as React from 'react';
import { Formik } from 'formik';

import { fulfilledProviders, noProviders } from '~/common/__test__/regions.fixtures';
import { FieldId, initialValues } from '~/components/clusters/wizards/rosa_v2/constants';
import ocpLifeCycleStatuses from '~/components/releases/__mocks__/ocpLifeCycleStatuses';
import { LONGER_CLUSTER_NAME_UI } from '~/redux/constants/featureConstants';
import clusterService from '~/services/clusterService';
import getOCPLifeCycleStatus from '~/services/productLifeCycleService';
import { mockUseFeatureGate, render, screen, withState } from '~/testUtils';

import Details from './Details';

jest.mock('~/services/clusterService');
jest.mock('~/services/productLifeCycleService');

const version = { id: '4.14.0' };

describe('<Details />', () => {
  const defaultValues = {
    ...initialValues,
    [FieldId.Hypershift]: 'false',
    [FieldId.ClusterVersion]: version,
    [FieldId.Region]: 'eu-north-1',
    [FieldId.HasDomainPrefix]: true,
  };

  describe('Region dropdown', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      (clusterService.getInstallableVersions as jest.Mock).mockResolvedValue({
        data: { items: [version] },
      });
      (getOCPLifeCycleStatus as jest.Mock).mockResolvedValue(ocpLifeCycleStatuses);
    });

    it('displays a spinner while regions are loading', async () => {
      const notLoadedState = {
        cloudProviders: noProviders,
      };
      (clusterService.getCloudProviders as jest.Mock).mockReturnValue(
        // a promise that won't be resolved, so providers become pending but not fulfilled.
        new Promise(() => {}),
      );

      withState(notLoadedState).render(
        <Formik initialValues={defaultValues} onSubmit={() => {}}>
          <Details />
        </Formik>,
      );

      expect(await screen.findByText('Loading region list...')).toBeInTheDocument();
    });

    it('displays the available regions when they are loaded', async () => {
      const loadedState = {
        cloudProviders: fulfilledProviders,
      };

      withState(loadedState).render(
        <Formik initialValues={defaultValues} onSubmit={() => {}}>
          <Details />
        </Formik>,
      );

      expect(await screen.findByText('eu-west-0, Avalon')).toBeInTheDocument();
      expect(await screen.findByText('single-az-3, Antarctica')).toBeInTheDocument();
    });
  });

  describe('Domain prefix', () => {
    it('is hidden when feature gate is not enabled', async () => {
      mockUseFeatureGate([[LONGER_CLUSTER_NAME_UI, false]]);

      render(
        <Formik initialValues={defaultValues} onSubmit={() => {}}>
          <Details />
        </Formik>,
      );

      expect(screen.queryByText('Domain prefix')).toBe(null);
    });

    it('displays the field when has_domain_prefix is selected', async () => {
      mockUseFeatureGate([[LONGER_CLUSTER_NAME_UI, true]]);

      render(
        <Formik initialValues={defaultValues} onSubmit={() => {}}>
          <Details />
        </Formik>,
      );

      expect(screen.queryByText('Domain prefix')).toBeInTheDocument();
    });

    it('is hidden when has_domain_prefix is false', async () => {
      mockUseFeatureGate([[LONGER_CLUSTER_NAME_UI, true]]);

      const newValues = { ...defaultValues, [FieldId.HasDomainPrefix]: false };

      render(
        <Formik initialValues={newValues} onSubmit={() => {}}>
          <Details />
        </Formik>,
      );

      expect(screen.queryByText('Domain prefix')).toBe(null);
    });
  });
});
