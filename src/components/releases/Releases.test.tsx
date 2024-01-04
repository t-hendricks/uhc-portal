import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import type axios from 'axios';

import apiRequest from '~/services/apiRequest';
import { mockRestrictedEnv, render, screen } from '~/testUtils';

import Releases from './index';
import ReleaseChannel from './ReleaseChannel';
import ocpLifeCycleStatuses from './__mocks__/ocpLifeCycleStatuses';

type MockedJest = jest.Mocked<typeof axios> & jest.Mock;
const apiRequestMock = apiRequest as unknown as MockedJest;

jest.mock('./ReleaseChannel', () => ({
  __esModule: true,
  namedExport: jest.fn(),
  default: jest.fn(),
}));

const MockReleaseChannel = ReleaseChannel as jest.Mock;

describe('<Releases />', () => {
  let wrapper: ReactWrapper;

  beforeEach(() => {
    apiRequestMock.get.mockResolvedValue(ocpLifeCycleStatuses);
  });
  beforeAll(() => {
    MockReleaseChannel.mockImplementation(
      ({ channel }: React.ComponentProps<typeof ReleaseChannel>) => (
        <dt className="pf-c-description-list__term pf-u-mt-md">{channel}</dt>
      ),
    );
  });

  // clear all mocks
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render', async () => {
    await act(async () => {
      wrapper = mount(<Releases />);
    });

    wrapper.update();
    expect(apiRequestMock.get).toHaveBeenCalledTimes(1);
    expect(wrapper).toMatchSnapshot();
  });

  describe('in restricted env', () => {
    const isRestrictedEnv = mockRestrictedEnv();
    afterAll(() => {
      isRestrictedEnv.mockReturnValue(false);
    });

    it('should render only stable releases', async () => {
      isRestrictedEnv.mockReturnValue(true);

      // eslint-disable-next-line testing-library/no-unnecessary-act
      await act(async () => {
        render(<Releases />);
      });
      expect(apiRequestMock.get).toHaveBeenCalledTimes(1);
      expect(screen.queryAllByText(/^stable/).length > 0).toBeTruthy();
      expect(screen.queryAllByText(/^fast/)).toHaveLength(0);
      expect(screen.queryAllByText(/^eus/).length > 0).toBeTruthy();
    });
  });
});
