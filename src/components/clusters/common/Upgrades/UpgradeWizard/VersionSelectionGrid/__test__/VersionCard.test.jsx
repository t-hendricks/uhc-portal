import React from 'react';
import { shallow } from 'enzyme';
import { Tooltip } from '@patternfly/react-core';
import VersionCard from '../VersionCard';

let wrapper;
let onKeyDown;
let onClick;

describe('<VersionCard>', () => {
  beforeEach(() => {
    onKeyDown = jest.fn();
    onClick = jest.fn();
    wrapper = shallow(
      <VersionCard
        isRecommended
        version="4.5.20"
        onKeyDown={onKeyDown}
        onClick={onClick}
        getUnMetClusterAcknowledgements={() => []}
      >
        The latest on your current minor version.
      </VersionCard>,
    );
  });

  it('should render correctly when recommended', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when selected & not recommended', () => {
    wrapper.setProps(
      {
        isSelected: true,
        version: '4.5.16',
        isRecommended: false,
      },
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render a tooltip without any unmet cluster acknowledgements', () => {
    expect(wrapper.find(Tooltip)).toHaveLength(0);
  });

  it('should render tooltip when has unmet cluster acknowledgements', () => {
    wrapper.setProps(
      {
        getUnMetClusterAcknowledgements: () => [{ id: 'someUpgradeGateId' }],
      },
    );

    expect(wrapper).toMatchSnapshot();
  });
});
