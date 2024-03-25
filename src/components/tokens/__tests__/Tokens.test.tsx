/*
Copyright (c) 2019 Red Hat, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from 'react';

import {
  mockRestrictedEnv,
  mockRefreshToken,
  render,
  screen,
  TestRouter,
  checkAccessibility,
  mockUseChrome,
} from '~/testUtils';
import { CompatRouter } from 'react-router-dom-v5-compat';
import Tokens from '../Tokens';

const mockGetToken = jest
  .fn()
  .mockResolvedValue({ data: { refresh_token: 'hello offline access token!' } });

window.insights = {
  chrome: {
    ...window.insights?.chrome,
    auth: {
      ...window.insights?.chrome?.auth,
      getOfflineToken: mockGetToken,
    },
  },
};

describe('<Tokens />', () => {
  mockRefreshToken();
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible with button', async () => {
    const { container } = render(
      <TestRouter>
        <CompatRouter>
          <Tokens show={false} showPath="/token/show" setOfflineToken={() => {}} />
        </CompatRouter>
      </TestRouter>,
    );

    expect(await screen.findByRole('button', { name: 'Load token' })).toBeInTheDocument();

    await checkAccessibility(container);
  });

  it('is accessible with token', async () => {
    const { container } = render(
      <TestRouter>
        <CompatRouter>
          <Tokens
            show={false}
            showPath="/token/show"
            offlineToken="test-token"
            setOfflineToken={() => {}}
          />
        </CompatRouter>
      </TestRouter>,
    );

    expect(await screen.findByRole('link', { name: 'Download ocm CLI' })).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('Renders loading screen', async () => {
    const { container } = render(
      <TestRouter>
        <CompatRouter>
          <Tokens show setOfflineToken={() => {}} />
        </CompatRouter>
      </TestRouter>,
    );

    expect(
      await screen.findByText('Copy and paste the authentication command in your terminal:'),
    ).toBeInTheDocument();
    expect(container.querySelector('.pf-v5-c-skeleton')).toBeInTheDocument();
  });

  it('Calls getOfflineToken', async () => {
    expect(mockGetToken).not.toHaveBeenCalled();

    render(
      <TestRouter>
        <CompatRouter>
          <Tokens show setOfflineToken={() => {}} />
        </CompatRouter>
      </TestRouter>,
    );
    expect(mockGetToken).toHaveBeenCalled();
    expect(await screen.findByRole('link', { name: 'Download ocm CLI' })).toBeInTheDocument();
  });

  describe('in restricted env', () => {
    const isRestrictedEnv = mockRestrictedEnv();
    afterAll(() => {
      isRestrictedEnv.mockReturnValue(false);
    });

    it('Renders screen with refresh token', async () => {
      isRestrictedEnv.mockReturnValue(true);
      mockUseChrome();
      render(
        <TestRouter>
          <CompatRouter>
            <Tokens offlineToken="refresh-token" setOfflineToken={() => {}} showPath="myshowpath" />
          </CompatRouter>
        </TestRouter>,
      );

      expect(await screen.findByText('Your API token')).toBeInTheDocument();
    });
  });
});
