import React from 'react';
import { shallow } from 'enzyme';
import ActionRequiredPopover from './ActionRequiredPopover';
import fixtures from '../../ClusterDetails/__test__/ClusterDetails.fixtures';

describe('<ActionRequiredPopover />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(
      <ActionRequiredPopover cluster={fixtures.ROSAManualClusterDetails} />,
    );
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
