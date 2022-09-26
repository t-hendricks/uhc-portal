import React from 'react';
import { shallow } from 'enzyme';
import { createMemoryHistory } from 'history';

import apiRequest from '../../../services/apiRequest';
import ApiError from './ApiError';
import TermsError from '../../common/TermsError';

jest.mock('../../../services/apiRequest');
const fixtures = {
  history: createMemoryHistory(),
  children: <div>ApiErrorChildren</div>,
  apiRequest,
  showApiError: jest.fn(),
  clearApiError: jest.fn(),
};

describe('ApiError', () => {
  it('should render children if no api errors', () => {
    const apiError = null;
    const wrapper = shallow(
      <ApiError {...fixtures} apiError={apiError}>
        {fixtures.children}
      </ApiError>,
    );
    expect(wrapper.equals(fixtures.children)).toBe(true);
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
    };
    const wrapper = shallow(
      <ApiError {...fixtures} apiError={apiError}>
        {fixtures.children}
      </ApiError>,
    );
    expect(
      wrapper.matchesElement(<TermsError error={apiError} restore={fixtures.clearApiError} />),
    ).toBe(true);
  });
});
