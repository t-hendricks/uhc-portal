import * as React from 'react';
import type axios from 'axios';

import apiRequest from '~/services/apiRequest';
import { screen, withState } from '~/testUtils';

import { BreakGlassCredentialList } from '../BreakGlassCredentialList';

import { BreakGlassCreds } from './BreakGlassCredentialList.fixtures';

type MockedJest = jest.Mocked<typeof axios> & jest.Mock;
const apiRequestMock = apiRequest as unknown as MockedJest;

const initialState = {
  clusters: {
    details: {
      cluster: {
        id: 'myCluster',
        canEdit: true,
      },
    },
  },
};
describe('<BreakGlassCredentialList />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('with no credentials set', () => {
    it('returns add new button', async () => {
      apiRequestMock.get.mockResolvedValue({ items: [], page: 1, size: 0, total: 0 });

      withState(initialState, true).render(<BreakGlassCredentialList />);
      expect(apiRequestMock.get).toHaveBeenCalledTimes(1);
      expect(apiRequestMock.get).toHaveBeenCalledWith(
        '/api/clusters_mgmt/v1/clusters/myCluster/break_glass_credentials',
      );
      expect(await screen.findByRole('button', { name: /New Credentials/i })).toBeInTheDocument();
    });
  });

  describe('with credentials set', () => {
    it('add button still shown', async () => {
      apiRequestMock.get.mockResolvedValue(BreakGlassCreds);

      withState(initialState, true).render(<BreakGlassCredentialList />);
      expect(apiRequestMock.get).toHaveBeenCalledTimes(1);
      expect(apiRequestMock.get).toHaveBeenCalledWith(
        '/api/clusters_mgmt/v1/clusters/myCluster/break_glass_credentials',
      );

      await screen.findByRole('button', { name: /New Credentials/i });
    });

    it('list shown of the credentials', async () => {
      apiRequestMock.get.mockResolvedValue(BreakGlassCreds);
      withState(initialState, true).render(<BreakGlassCredentialList />);

      expect(await screen.findByText('ID')).toBeInTheDocument();
      expect(await screen.findByText('Username')).toBeInTheDocument();
      expect(await screen.findByText('Expires')).toBeInTheDocument();
      expect(await screen.findByText('Status')).toBeInTheDocument();
      expect(await screen.findByText('user1')).toBeInTheDocument();
      expect(await screen.findByText('testname1')).toBeInTheDocument();
    });
  });
});
