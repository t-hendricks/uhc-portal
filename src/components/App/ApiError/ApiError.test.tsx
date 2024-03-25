import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';
import type { AxiosResponse } from 'axios';
import { TestRouter, screen, render } from '~/testUtils';
import apiRequest from '~/services/apiRequest';
import ApiError from './ApiError';

const defaultProps = {
  children: <div>ApiErrorChildren</div>,
  apiRequest,
  showApiError: jest.fn(),
  clearApiError: jest.fn(),
};

describe('ApiError', () => {
  it('should render children if no api errors', () => {
    const apiError = null;
    render(
      <TestRouter>
        <CompatRouter>
          <ApiError {...defaultProps} apiError={apiError}>
            {defaultProps.children}
          </ApiError>
        </CompatRouter>
      </TestRouter>,
    );

    expect(screen.getByText('ApiErrorChildren')).toBeInTheDocument();
  });

  it('should render terms error page', () => {
    const apiError = {
      data: {
        id: '451',
        code: 'CLUSTERS-MGMT-451',
        reason: 'Legal terms should be agreed. See details',
        details: [
          {
            legal_terms_url: 'https://www.redhat.com/wapps/tnc/ackrequired?site=ocm&event=register',
          },
        ],
      },
    } as AxiosResponse;

    render(
      <TestRouter>
        <CompatRouter>
          <ApiError {...defaultProps} apiError={apiError}>
            {defaultProps.children}
          </ApiError>
        </CompatRouter>
      </TestRouter>,
    );

    expect(screen.getByRole('link', { name: 'View Terms and Conditions' })).toBeInTheDocument();
  });
});
