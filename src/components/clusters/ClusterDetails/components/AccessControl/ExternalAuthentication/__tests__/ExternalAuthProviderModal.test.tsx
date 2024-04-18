import React from 'react';
import type axios from 'axios';

import apiRequest from '~/services/apiRequest';
import { render, screen } from '~/testUtils';

import { ExternalAuthProviderModal } from '../ExternalAuthProviderModal';

jest.mock('~/components/common/Modal/ModalActions');
const mockModalData = {
  clusterId: 'cluster1',
  provider: {
    id: 'myprovider1',
    issuer: { url: 'https://redhat.com', audiences: ['abc'] },
    claim: { mappings: { username: { claim: 'email' }, groups: { claim: 'groups' } } },
  },
  onClose: jest.fn(),
  isEdit: false,
};
type MockedJest = jest.Mocked<typeof axios> & jest.Mock;
const apiRequestMock = apiRequest as unknown as MockedJest;

describe('<ExternalAuthProviderModal />', () => {
  it('should show correct title and content', async () => {
    render(
      <ExternalAuthProviderModal
        clusterID={mockModalData.clusterId}
        onClose={mockModalData.onClose}
      />,
    );

    expect(screen.queryByText(/Add external authentication provider/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/An external authentication provider controls access to your cluster/i),
    ).toBeInTheDocument();
  });
  it('ask for name and url', () => {
    render(
      <ExternalAuthProviderModal
        clusterID={mockModalData.clusterId}
        onClose={mockModalData.onClose}
      />,
    );
    expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Issuer URL' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Audiences' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Groups mapping' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Username mapping' })).toBeInTheDocument();
  });

  it('closes modal on cancel', async () => {
    const { user } = render(
      <ExternalAuthProviderModal
        clusterID={mockModalData.clusterId}
        onClose={mockModalData.onClose}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(mockModalData.onClose).toBeCalled();
  });

  it('calls post api on Add', async () => {
    const apiReturnValue = {
      data: {
        id: 'myprovider1',
        issuer: { url: 'https://redhat.com', audiences: ['abc'] },
        claim: { mappings: { username: { claim: 'email' }, groups: { claim: 'groups' } } },
      },
    };
    apiRequestMock.post.mockResolvedValue(apiReturnValue);

    const { user } = render(
      <ExternalAuthProviderModal
        clusterID={mockModalData.clusterId}
        onClose={mockModalData.onClose}
      />,
    );
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'myprovider1');
    await user.type(screen.getByRole('textbox', { name: 'Issuer URL' }), 'https://redhat.com');
    await user.type(screen.getByRole('textbox', { name: 'Audiences' }), 'abc');
    await user.type(screen.getByRole('textbox', { name: 'Groups mapping' }), 'groups');
    await user.type(screen.getByRole('textbox', { name: 'Username mapping' }), 'email');

    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(apiRequest.post).toHaveBeenCalledTimes(1);
    const mockPostBreakGlassCallParams = apiRequestMock.post.mock.calls[0];
    expect(mockPostBreakGlassCallParams[0]).toBe(
      '/api/clusters_mgmt/v1/clusters/cluster1/external_auth_config/external_auths',
    );
  });
});
