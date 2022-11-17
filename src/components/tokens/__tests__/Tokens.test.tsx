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
import { mount, shallow } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../../redux/store';

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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Renders screen with button', () => {
    const component = shallow(
      <Tokens show={false} showPath="/token/show" setOfflineToken={() => {}} />,
    );
    expect(component).toMatchSnapshot();
  });

  it('Renders screen with token', () => {
    const component = shallow(
      <Tokens
        show={false}
        showPath="/token/show"
        offlineToken="test-token"
        setOfflineToken={() => {}}
      />,
    );
    expect(component).toMatchSnapshot();
  });

  it('Renders loading screen', () => {
    const loadingcomponent = shallow(<Tokens show setOfflineToken={() => {}} />);
    expect(loadingcomponent).toMatchSnapshot();
  });

  it('Calls getOfflineToken', () => {
    mount(<Tokens show setOfflineToken={() => {}} />, {
      wrappingComponent: ({ children }) => (
        <Provider store={store}>
          <BrowserRouter>{children}</BrowserRouter>
        </Provider>
      ),
    });
    expect(mockGetToken).toBeCalled();
  });

  it('Renders token', () => {
    const component = shallow(<Tokens show setOfflineToken={() => {}} />);
    expect(component).toMatchSnapshot();
  });
});
