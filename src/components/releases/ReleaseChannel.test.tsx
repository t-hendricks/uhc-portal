import React from 'react';
import { mount } from 'enzyme';
import axios from 'axios';
import { act } from 'react-dom/test-utils';

import ReleaseChannel from './ReleaseChannel';
import ocpReleases from './__mocks__/ocpReleases';

jest.mock('axios');

describe('<ReleaseChannel />', () => {
  let wrapper;

  // clear all mocks
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render', async () => {
    await act(async () => {
      await axios.get.mockImplementationOnce(() => Promise.resolve(ocpReleases));
      wrapper = mount(<ReleaseChannel channel="stable-4.6" />);
    });

    wrapper.update();
    await expect(axios.get).toHaveBeenCalledTimes(1);
    await expect(wrapper).toMatchSnapshot();
  });
});
