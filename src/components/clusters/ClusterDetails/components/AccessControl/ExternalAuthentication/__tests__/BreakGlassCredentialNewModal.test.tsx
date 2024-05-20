import React from 'react';
import type axios from 'axios';

import apiRequest from '~/services/apiRequest';
import { render, screen } from '~/testUtils';

import { BreakGlassCredentialNewModal } from '../BreakGlassCredentialNewModal';

jest.mock('~/components/common/Modal/ModalActions');
const mockModalData = {
  clusterId: 'cluster1',
  credential: {
    id: 'user1',
    username: 'user',
    expiration_timestamp: '2022-01-01T00:00:00Z',
  },
  onClose: jest.fn(),
};
type MockedJest = jest.Mocked<typeof axios> & jest.Mock;
const apiRequestMock = apiRequest as unknown as MockedJest;

describe('<BreakGlassCredentialNewModal />', () => {
  it('should show correct title and content', async () => {
    render(
      <BreakGlassCredentialNewModal
        clusterId={mockModalData.clusterId}
        onClose={mockModalData.onClose}
        isNewModalOpen
      />,
    );

    expect(screen.queryByText(/Add break glass credential/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Add a break glass credential to access the cluster./i),
    ).toBeInTheDocument();
  });
  it('ask for username and expiration', () => {
    render(
      <BreakGlassCredentialNewModal
        clusterId={mockModalData.clusterId}
        onClose={mockModalData.onClose}
        isNewModalOpen
      />,
    );
    expect(screen.queryByText(/Username/i)).toBeInTheDocument();
  });

  it('closes modal on cancel', async () => {
    const { user } = render(
      <BreakGlassCredentialNewModal
        clusterId={mockModalData.clusterId}
        onClose={mockModalData.onClose}
        isNewModalOpen
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(mockModalData.onClose).toHaveBeenCalled();
  });

  it('Shows warning on invalid username with space', async () => {
    const apiReturnValue = {
      data: { username: 'user1', expiration_timestamp: '2024-05-02T21:32:55.035Z' },
    };
    apiRequestMock.post.mockResolvedValue(apiReturnValue);

    const { user } = render(
      <BreakGlassCredentialNewModal
        clusterId={mockModalData.clusterId}
        onClose={mockModalData.onClose}
        isNewModalOpen
      />,
    );
    await user.type(screen.getByRole('textbox', { name: 'Username' }), 'us er1');
    await user.click(screen.getByRole('spinbutton', { name: 'Hours until credentials expire' }));
    expect(
      screen.queryByText(/Only alphanumeric characters and hyphens are allowed/i),
    ).toBeInTheDocument();
  });

  it('Shows warning on invalid username with invalid characters', async () => {
    const apiReturnValue = {
      data: { username: 'user1', expiration_timestamp: '2024-05-02T21:32:55.035Z' },
    };
    apiRequestMock.post.mockResolvedValue(apiReturnValue);

    const { user } = render(
      <BreakGlassCredentialNewModal
        clusterId={mockModalData.clusterId}
        onClose={mockModalData.onClose}
        isNewModalOpen
      />,
    );
    await user.type(screen.getByRole('textbox', { name: 'Username' }), 'user1?@');
    await user.click(screen.getByRole('spinbutton', { name: 'Hours until credentials expire' }));
    expect(
      screen.queryByText(/Only alphanumeric characters and hyphens are allowed/i),
    ).toBeInTheDocument();
  });

  it('calls post api on Add', async () => {
    const apiReturnValue = {
      data: { username: 'user1', expiration_timestamp: '2024-05-02T21:32:55.035Z' },
    };
    apiRequestMock.post.mockResolvedValue(apiReturnValue);

    const { user } = render(
      <BreakGlassCredentialNewModal
        clusterId={mockModalData.clusterId}
        onClose={mockModalData.onClose}
        isNewModalOpen
      />,
    );
    await user.type(screen.getByRole('textbox', { name: 'Username' }), 'user1');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(apiRequest.post).toHaveBeenCalledTimes(1);
    const mockPostBreakGlassCallParams = apiRequestMock.post.mock.calls[0];
    expect(mockPostBreakGlassCallParams[0]).toBe(
      '/api/clusters_mgmt/v1/clusters/cluster1/break_glass_credentials',
    );
  });
});
