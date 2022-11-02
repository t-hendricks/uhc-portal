import React from 'react';
import { mount } from 'enzyme';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import PropTypes from 'prop-types';

import Releases from './index';
import ReleaseChannel from './ReleaseChannel';
import ocpLifeCycleStatuses from './__mocks__/ocpLifeCycleStatuses';

jest.mock('axios');

const MockReleaseChannel = ({ channel }) => {
  React.useEffect(() => {});
  return <dt className="pf-c-description-list__term pf-u-mt-md">{channel}</dt>;
};

MockReleaseChannel.propTypes = {
  channel: PropTypes.string.isRequired,
};

jest.mock('./ReleaseChannel', () => ({
  __esModule: true,
  namedExport: jest.fn(),
  default: jest.fn(),
}));

describe('<Releases />', () => {
  let wrapper;

  beforeAll(() => {
    ReleaseChannel.mockImplementation(MockReleaseChannel);
  });

  // clear all mocks
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render', async () => {
    await act(async () => {
      await axios.get.mockImplementationOnce(() => Promise.resolve(ocpLifeCycleStatuses));
      wrapper = mount(<Releases />);
    });

    wrapper.update();
    await expect(axios.get).toHaveBeenCalledTimes(1);
    await expect(wrapper).toMatchSnapshot();
  });
});
