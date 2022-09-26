import React from 'react';
import { shallow } from 'enzyme';

import * as Fixtures from './ArchivedClusterListTable.fixtures';
import ArchivedClusterListTable from '../ArchivedClusterListTable';

describe('<ArchivedClusterListTable />', () => {
  describe('ArchivedClusterListTable', () => {
    const wrapper = shallow(
      <ArchivedClusterListTable
        viewOptions={{
          flags: {},
          fields: {},
          sorting: {
            sortIndex: 0,
            isAscending: true,
            sortField: 'name',
          },
        }}
        {...Fixtures}
      />,
    );

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
