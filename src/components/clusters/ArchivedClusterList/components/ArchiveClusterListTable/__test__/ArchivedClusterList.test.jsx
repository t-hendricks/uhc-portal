import React from 'react';
import { shallow } from 'enzyme';

import * as Fixtures from './ArchivedClusterList.fixtures';
import ArchivedClusterList from '../../../ArchivedClusterList';

describe('<ArchivedClusterList />', () => {
  describe('ArchivedClusterList', () => {
    const wrapper = shallow(
      <ArchivedClusterList
        viewOptions={{
          flags: {},
          fields: {},
        }}
        {...Fixtures}
      />,
    );

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
