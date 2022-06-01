import React from 'react';
import { shallow } from 'enzyme';
import ActionRequiredLink from './ActionRequiredLink';
import fixtures from '../../ClusterDetails/__test__/ClusterDetails.fixtures';

describe('<ActionRequiredLink />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(
      <ActionRequiredLink cluster={fixtures.ROSAManualClusterDetails} />,
    );
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
