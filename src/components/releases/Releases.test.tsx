import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import Releases from './index';
import ReleaseChannel from './ReleaseChannel';
import ocpLifeCycleStatuses from './__mocks__/ocpLifeCycleStatuses';

jest.mock('axios');

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
      await (axios.get as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve(ocpLifeCycleStatuses),
      );
      wrapper = mount(<Releases />);
    });

    wrapper.update();
    await expect(axios.get).toHaveBeenCalledTimes(1);
    await expect(wrapper).toMatchSnapshot();
  });
});
