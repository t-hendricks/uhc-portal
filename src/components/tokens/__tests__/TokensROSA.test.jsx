/*
Copyright (c) 2020 Red Hat, Inc.

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
import { shallow } from 'enzyme';

import TokensROSA from '../TokensROSA';

const mockGetToken = jest.fn().mockResolvedValue({ data: { refresh_token: 'hello offline access token!' } });

window.insights = {
  chrome: {
    auth: {
      getOfflineToken: mockGetToken,
    },
  },
};

describe('<TokensROSA />', () => {
  it('Renders screen with button', () => {
    const component = shallow(<TokensROSA show={false} showPath="/token/show" />);
    expect(mockGetToken).not.toBeCalled();
    expect(component).toMatchSnapshot();
  });

  it('Renders loading screen', () => {
    const loadingcomponent = shallow(<TokensROSA show />);
    expect(loadingcomponent).toMatchSnapshot();
  });

  // Skipping due to delay kludge in componentDidMount
  // https://issues.redhat.com/browse/SDA-4502
  it.skip('Calls getOfflineToken', () => {
    shallow(<TokensROSA show />);
    expect(mockGetToken).toBeCalled();
  });

  it('Renders token', () => {
    const component = shallow(<TokensROSA show />);
    expect(component).toMatchSnapshot();
  });
});
