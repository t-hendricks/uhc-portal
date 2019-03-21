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
import { shallow } from 'enzyme';

import Tokens from '../Tokens';

describe('<Tokens />', () => {
  it('Renders correctly', () => {
    const component = shallow(<Tokens
      accessToken="hello access token!"
      refreshToken="and a refresh token too"
    />);
    expect(component).toMatchSnapshot();
  });
});
