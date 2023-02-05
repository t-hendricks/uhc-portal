import React from 'react';
import { shallow } from 'enzyme';

import ClusterTypeLabel from './ClusterTypeLabel';
import fixtures from '../ClusterDetails/__test__/ClusterDetails.fixtures';

describe('ClusterTypeLabel', () => {
  it('for ROSA hypershift', () => {
    const { cluster } = fixtures.ROSAHypershiftClusterDetails;
    const wrapper = shallow(<ClusterTypeLabel cluster={cluster} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('for classic ROSA', () => {
    const { cluster } = fixtures.ROSAClusterDetails;
    const wrapper = shallow(<ClusterTypeLabel cluster={cluster} />);
    expect(wrapper).toMatchSnapshot();
  });
});
