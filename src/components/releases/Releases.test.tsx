import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import axios from 'axios';
import { screen } from '@testing-library/dom';
import { act } from 'react-dom/test-utils';
import { mockRestrictedEnv, render } from '~/testUtils';
import Releases from './index';
import ReleaseChannel from './ReleaseChannel';
import ocpLifeCycleStatuses from './__mocks__/ocpLifeCycleStatuses';

jest.mock('axios', () => ({
  ...jest.requireActual('axios'),
  get: jest.fn().mockImplementation(() => Promise.resolve(ocpLifeCycleStatuses)),
}));

jest.mock('./ReleaseChannel', () => ({
  __esModule: true,
  namedExport: jest.fn(),
  default: jest.fn(),
}));

const MockReleaseChannel = ReleaseChannel as jest.Mock;

describe('<Releases />', () => {
  let wrapper: ReactWrapper;

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
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(wrapper).toMatchSnapshot();
  });

  describe('in restricted env', () => {
    const isRestrictedEnv = mockRestrictedEnv();
    afterAll(() => {
      isRestrictedEnv.mockReturnValue(false);
    });

    it('should render only 4.11 releases', async () => {
      isRestrictedEnv.mockReturnValue(true);

      await act(async () => {
        render(<Releases />);
      });
      expect(axios.get).toHaveBeenCalledTimes(1);

      expect(screen.getByTestId('version-4.11')).toBeInTheDocument();
      expect(screen.getAllByTestId(/version-.*/)).toHaveLength(1);
    });
  });
});
